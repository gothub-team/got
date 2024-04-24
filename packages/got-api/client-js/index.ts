import { Buffer } from 'buffer';
import { useSrp } from '@gothub-team/got-srp';
import { createLowApi, type LoginVerifyOutput, type ResetPasswordVerifyInput } from './api.js';
import { put } from './fetch.js';

export { createLowApi } from './api.js';
export { post, put } from './fetch.js';

export declare interface UploadOptions {
    /**
     * Content type of the file.
     */
    contentType: string;
    /**
     * Upload ID of the file.
     */
    uploadId: string;
    /**
     * Size of each part in bytes. Defaults to 5MB.
     */
    partSize?: number;
    /**
     * Function to be called on each part upload progress.
     */
    onProgress?: (progress: number) => void;
}

export interface LoginInput {
    /**
     * Email of the user to be logged in.
     */
    email: string;
    /**
     * Password of the user to be logged in.
     */
    password: string;
}

export interface PasswordChallengeInput extends LoginInput {
    /**
     * Password to be set.
     */
    newPassword: string;
}

const isExpired = (msTimestamp?: number) => msTimestamp && msTimestamp * 1000 < Date.now() + 100000;

const decodeJwt = (jwt: string) => {
    try {
        const result = Buffer.from(jwt.split('.')[1], 'base64').toString('utf8');
        return JSON.parse(result);
    } catch (error) {
        console.error('Invalid JWT');
        return null;
    }
};

const useState = <T, FT extends (val: T) => T = (val: T) => T>(initialValue: T): [() => T, (v: T | FT) => void] => {
    const reference = { current: initialValue };
    const getState = () => reference.current;
    const setState = (newValue: T | FT) => {
        if (typeof newValue === 'function') {
            reference.current = (newValue as FT)(reference.current);
        } else {
            reference.current = newValue;
        }
    };
    return [getState, setState];
};

const useSingletonPromise = <T>(asyncFn: () => Promise<T>) => {
    const [getSingletonPromise, setSingletonPromise] = useState<Promise<T> | null>(null);
    return async () => {
        if (!getSingletonPromise()) {
            const promise = asyncFn();
            setSingletonPromise(promise);
            const result = await promise;
            setSingletonPromise(null);
            return result;
        }
        return getSingletonPromise();
    };
};

export declare interface Session extends LoginVerifyOutput {
    /**
     * Expiration unix timestamp of refresh in miliseconds.
     */
    refreshTokenExpires?: number;
}
export declare interface SessionStore {
    getSession: () => Session | undefined;
    setSession: (session: Session) => void;
    removeSession: () => void;
}
export type CreateApiOptions = {
    /**
     * Host of got provider API to connect to. (e.g. https://api.gothub.io)
     */
    host: string;
    /**
     * External store object to manage session (e.g. local storage)
     */
    sessionStore?: SessionStore;
    /**
     * Whether or not to call the API in admin mode.
     */
    adminMode?: boolean;
    /**
     * The time in miliseconds after which the session will expire. Defaults to 28 days.
     */
    sessionExpireTime?: number;
};
export const createApi = ({
    host,
    sessionStore: { getSession, setSession, removeSession } = {
        getSession: () => undefined,
        setSession: () => {},
        removeSession: () => {},
    },
    adminMode = false,
    sessionExpireTime = 2419200000, // 28 days
}: CreateApiOptions) => {
    if (!host) throw new Error('Provide host argument to create API.');
    const _host = host.endsWith('/') ? host.substring(0, host.length - 1) : host;

    const [_getLocalSession, _setLocalSession] = useState<Session | undefined>(getSession());
    const [getAdminMode, setAdminMode] = useState(adminMode);

    const api = createLowApi({
        host: _host,
        getIdToken: async () => {
            const { idToken } = _getLocalSession() || {};
            if (idToken && isExpired(decodeJwt(idToken).exp)) {
                await refreshSession();
                return _getLocalSession()?.idToken;
            }
            return idToken;
        },
        getAdminMode,
    });

    const _setSession = (newValue: Parameters<typeof _setLocalSession>[0]) => {
        _setLocalSession(newValue);
        const session = _getLocalSession();
        session && setSession(session);
    };
    const _removeSession = () => {
        _setLocalSession(undefined);
        removeSession();
    };

    const refreshSession = useSingletonPromise(async () => {
        const { refreshToken } = _getLocalSession() || {};
        if (!refreshToken) return;
        const newSession = await api.loginRefresh({ refreshToken });
        _setSession((oldSession: Session | undefined) => ({ ...oldSession, ...newSession }));
    });

    const getCurrentSession = () => {
        const session = _getLocalSession();
        if (isExpired(session?.refreshTokenExpires)) {
            _removeSession();
            return undefined;
        }
        return session;
    };

    return {
        ...api,
        login: async ({ email, password }: LoginInput) => {
            const { srpA, getSignature } = await useSrp();

            const { salt, secretBlock, srpB, userId, poolname } = await api.loginInit({
                email,
                srpA,
            });

            const { signature, timestamp } = await getSignature({
                poolname,
                userId,
                password,
                srpB,
                secretBlock,
                salt,
            });

            const result = await api.loginVerify({
                userId,
                timestamp,
                secretBlock,
                signature,
            });

            _setSession({
                ...result,
                refreshTokenExpires: (Date.now() + sessionExpireTime) / 1000,
            });
        },
        logout: () => _removeSession(),
        resetPasswordVerify: async ({ email, password, oldPassword, verificationCode }: ResetPasswordVerifyInput) => {
            const result = await api.resetPasswordVerify({
                email,
                verificationCode,
                oldPassword,
                password,
            });

            // only password challenge returns session credentials
            if (oldPassword) {
                _setSession({
                    ...result,
                    refreshTokenExpires: (Date.now() + sessionExpireTime) / 1000,
                });
            }
        },
        refreshSession,
        getCurrentSession,
        getCurrentUser: () => {
            const session = getCurrentSession();
            return session?.idToken ? decodeJwt(session.idToken) : undefined;
        },
        getAdminMode,
        setAdminMode,
        upload: async (
            uploadUrls: string[],
            file: Blob,
            { contentType, uploadId, partSize = 5242880, onProgress }: UploadOptions,
        ) => {
            const promiseSequence = async (fns: (() => Promise<Response>)[]) => {
                const res = [];

                for (let i = 0; i < fns.length; i++) {
                    res.push(await fns[i]());
                    onProgress && onProgress((i + 1) / fns.length);
                }
                return res;
            };
            const uploadPromises = uploadUrls.map((url, i, arr) => {
                const start = i * partSize;
                const end = (i + 1) * partSize;
                const blob = i < arr.length - 1 ? file.slice(start, end) : file.slice(start);
                return async () => put(url, blob, contentType);
            });
            const results = await promiseSequence(uploadPromises);

            if (uploadId && uploadUrls && uploadUrls.length > 1) {
                const partEtags = results.map((r) => JSON.parse(r.headers.get('etag') || '""'));
                await api.completeUpload({
                    uploadId,
                    partEtags,
                });
            }
        },
        setCurrentSession: _setSession,
    };
};

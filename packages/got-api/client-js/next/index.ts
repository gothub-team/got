import { useSrp } from '@gothub-team/got-srp';
import { createLowApi, type GotLowApi, type InviteUserInput, type LoginVerifyOutput } from '../api.js';
import { post, put } from '../fetch.js';
import type { PushBody, PushResult } from '@gothub/got-core';

export { createLowApi } from '../api.js';
export { post, put } from '../fetch.js';

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

export declare interface GotApi extends GotLowApi {
    /**
     * This operation pushes the graph from the request body into the database.
     *
     * @throws
     * ```JS
     * {
     *     name: 'PushError',
     *     message: 'The push operation failed.',
     * }
     */
    push: (input: PushBody, asRole?: string) => Promise<PushResult>;
    /**
     * This operation is a convenience function that combines loginInit and loginVerify.
     * It establishes an SRP session using `@gothub-team/got-srp` and computes the signature
     * on the client side using the specified password. If verification is successful, it
     * returns all authentication tokens.
     *
     *  @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'LoginVerifyError',
     *     message: 'The password could not be verified. Please check userId, secretBlock, signature and timestamp.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'UserNotVerifiedError',
     *     message: 'The user must be verified with Register Verify operation.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'PasswordResetRequiredError',
     *     message: 'The password must be reset.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'UserNotFoundError',
     *     message: 'No user was found under the given email or user ID.',
     * }
     * ```
     */
    login: (input: LoginInput) => Promise<LoginVerifyOutput>;
    /**
     * This operation uploads a file blob using a given set of uploadUrls.
     * If the length of uploadUrls is greater than 1 does multipart upload.
     */
    upload: (uploadUrls: string[], file: Blob, options: UploadOptions) => Promise<void>;
    /**
     * This operation creates a user with the given email provided they do not exist yet.
     *
     */
    inviteUser: <const TInviteUserInput extends InviteUserInput>(
        input: TInviteUserInput,
    ) => Promise<TInviteUserInput extends LoginInput ? Session : { message: string } | string>;
}

export declare interface Session extends LoginVerifyOutput {
    /**
     * Expiration unix timestamp of refresh in miliseconds.
     */
    refreshTokenExpires?: number;
}
export declare interface SessionStore {
    getSession: () => Session | Promise<Session> | undefined;
    setSession: (session: Session) => void;
    removeSession: () => void;
}
export type CreateApiOptions = {
    /**
     * Host of got provider API to connect to. (e.g. https://api.gothub.io)
     */
    host: string;
    /**
     * Whether or not to call the API in admin mode.
     */
    adminMode?: boolean;
    /**
     * Id token that is used to execute authenticated API calls.
     */
    idToken?: string;
};
export const createApi = ({ host, adminMode = false, idToken }: CreateApiOptions): GotApi => {
    if (!host) throw new Error('Provide host argument to create API.');
    const _host = host.endsWith('/') ? host.substring(0, host.length - 1) : host;

    const api = createLowApi({
        host: _host,
        getIdToken: async () => idToken,
        getAdminMode: () => adminMode,
    });

    return {
        ...api,
        push: async (body: PushBody, asRole?: string) => post(`${host}/push`, body, idToken, adminMode, asRole),
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

            return api.loginVerify({
                userId,
                timestamp,
                secretBlock,
                signature,
            });
        },
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
        inviteUser: (async (input) => api.inviteUser(input)) as GotApi['inviteUser'],
    };
};

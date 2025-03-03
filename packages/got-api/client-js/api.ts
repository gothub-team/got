import { post } from './fetch.js';
import type { Graph, View, PushBody, PushResult } from '@gothub/got-core';

export interface CreateLowApiOtions {
    /**
     * Host of got provider API to connect to. (e.g. https://api.gothub.io)
     */
    host: string;
    /**
     * Function to get the ID token which is used with all API requests that require authentication.
     */
    getIdToken: () => Promise<string | undefined>;
    /**
     * Function to get whether or not to call the API in admin mode.
     */
    getAdminMode: () => boolean;
}

export type CreateLowApiFn = (options: CreateLowApiOtions) => GotLowApi;

/**
 * Creates the low level API which wraps all got REST API operations.
 */
export const createLowApi: CreateLowApiFn = ({ host, getIdToken = async () => '', getAdminMode = () => false }) => ({
    pull: async (input) => post(`${host}/pull`, input, await getIdToken(), getAdminMode()),
    push: async (input) => post(`${host}/push`, input, await getIdToken(), getAdminMode()),
    completeUpload: async (input) => post(`${host}/media/complete-upload`, input, await getIdToken(), getAdminMode()),
    loginInit: async (input) => post(`${host}/auth/login-init`, input),
    loginVerify: async (input) => post(`${host}/auth/login-verify`, input),
    loginRefresh: async (input) => post(`${host}/auth/login-refresh`, input),
    registerInit: async (input) => post(`${host}/auth/register-init`, input),
    registerVerify: async (input) => post(`${host}/auth/register-verify`, input),
    registerVerifyResend: async (input) => post(`${host}/auth/register-verify-resend`, input),
    resetPasswordInit: async (input) => post(`${host}/auth/reset-password-init`, input),
    resetPasswordVerify: async (input) => post(`${host}/auth/reset-password-verify`, input),
    inviteUser: async (input) => post(`${host}/auth/invite-user`, input, await getIdToken(), getAdminMode()),
});

export interface GotLowApi {
    /**
     * This operation pulls a graph based on a given hashmap of queries.
     *
     */
    pull: (input: View) => Promise<Graph>;

    /**
     * This operation pushes the graph from the request body into the database.
     *
     */
    push: (input: PushBody) => Promise<PushResult>;

    /**
     * This operation completes a previously executed multipart upload. Multipart uploads are initiated via push operations.
     *
     */
    completeUpload: (input: CompleteUploadInput) => Promise<unknown>;

    /**
     * This operation initiates a user login with a client generated SRP A value and returns challenge parameters needed to calculate the signature. The signature is then sent back to the server using the Login Verify operation.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'InvalidSrpAError',
     *     message: 'The SRP A value must be a correctly calculated random hex hash based on big integers.',
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
    loginInit: (input: LoginInitInput) => Promise<LoginInitOutput>;

    /**
     * This operation executes a user login using an SRP signature calculated by the client and returns all auth tokens in case of success.
     * @throws
     * ```JS
     * {
     *     name: 'LoginVerifyError',
     *     message: 'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
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
    loginVerify: (input: LoginVerifyInput) => Promise<LoginVerifyOutput>;

    /**
     * This operation executes a user login using a refresh token and returns all auth tokens in case of success.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidRefreshTokenError',
     *     message: 'Refresh token is invalid.',
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
    loginRefresh: (input: LoginRefreshInput) => Promise<LoginRefreshOutput>;

    /**
     * This operation registers a new user with the API in order for him to authenticate for all API operations.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'InvalidPasswordError',
     *     message: 'The password must contain at least 8 characters and at least 1 number.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'UserExistsError',
     *     message: 'There is an existing user with the given email address.',
     * }
     * ```
     */
    registerInit: (input: RegisterInitInput) => Promise<unknown>;

    /**
     * This operation verifies a previously registered user with an verification code that was sent to his email after the register operation.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'VerificationCodeMismatchError',
     *     message: 'The verification code does not match.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'VerificationCodeExpiredError',
     *     message: 'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
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
    registerVerify: (input: RegisterVerifyInput) => Promise<unknown>;

    /**
     * This operation resends the verification code for a previously registered but not yet verified user.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
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
    registerVerifyResend: (input: RegisterVerifyResendInput) => Promise<unknown>;

    /**
     * This operation initiates the forgot password procedure. An email with verification code is sent automatically to the users email.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
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
     *     name: 'UserNotFoundError',
     *     message: 'No user was found under the given email or user ID.',
     * }
     * ```
     */
    resetPasswordInit: (input: ResetPasswordInitInput) => Promise<unknown>;

    /**
     * This operation resets the password of the given user using the email address and verification code sent to this email address after calling the Reset Password Init operation.
     * @throws
     * ```JS
     * {
     *     name: 'InvalidEmailError',
     *     message: 'The email must be valid and must not contain upper case letters or spaces.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'InvalidPasswordError',
     *     message: 'The password must contain at least 8 characters and at least 1 number.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'VerificationCodeMismatchError',
     *     message: 'The verification code does not match.',
     * }
     * ```
     * @throws
     * ```JS
     * {
     *     name: 'VerificationCodeExpiredError',
     *     message: 'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
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
     *     name: 'UserNotFoundError',
     *     message: 'No user was found under the given email or user ID.',
     * }
     * ```
     */
    resetPasswordVerify: (input: ResetPasswordVerifyInput) => Promise<ResetPasswordVerifyOutput>;

    /**
     * This operation creates a user with the given email provided they do not exist yet.
     *
     */
    inviteUser: (input: InviteUserInput) => Promise<unknown>;
}

export interface PullInput {
    /**
     * Hash map of node entry points into the query. Edges will be retrieved starting at the `rootNodeId`s
     */
    [rootNodeId: string]: Query;
}

/**
 * Holds a query object that specifies how the graph should be queried from a given entry
 * point. The entry point can be a node ID or an edge pointing do a set of nodes
 */
export interface Query {
    /**
     * Defines an optional alias for the query object, which is currently ignored by the API.
     */
    as?: string;
    /**
     * Specifies a hashmap of edge types `fromType/toType` which should further be fetched from
     * a given node or another parent edge query.
     */
    edges?: { [key: string]: Query };
    /**
     * Specifies which data should be returned for the given node or for multiple nodes the
     * given edge type (e.g. "todo-app/todo-list") is pointing to
     */
    include?: Include;
    /**
     * Defines if the edge should be read out in reverse
     */
    reverse?: boolean;
    /**
     * Defines the role which will be used to check the rights of the given node. If no role is
     * given, the rights of the current user will be used.
     */
    role?: string;
}

/**
 * Specifies which data should be returned for the given node or for multiple nodes the
 * given edge type (e.g. "todo-app/todo-list") is pointing to
 */
export interface Include {
    /**
     * `true` when the edges should be included in the response. `false` when they should
     * explicitly be excluded from the response.
     */
    edges?: boolean;
    /**
     * `true` when the node files should be included in the response. `false` when they should
     * explicitly be excluded from the response.
     */
    files?: boolean;
    /**
     * `true` when edge metadata data should be included in the response. `false` when they
     * should explicitly be excluded from the response.
     */
    metadata?: boolean;
    /**
     * `true` when the node(s) data should be included in the response. `false` when they should
     * explicitly be excluded from the response.
     */
    node?: boolean;
    /**
     * `true` when the node rights should be included in the response. `false` when they should
     * explicitly be excluded from the response.
     */
    rights?: boolean;
}

export interface PushInput {
    /**
     * `fromType`s: A `fromType` hashmap representing all `fromType`s of all present edges.
     */
    edges?: {
        [key: string]: {
            [key: string]: {
                [key: string]: {
                    [key: string]:
                        | boolean
                        | {
                              [key: string]:
                                  | Array<boolean | number | { [key: string]: unknown } | null | string>
                                  | boolean
                                  | number
                                  | { [key: string]: unknown }
                                  | null
                                  | string;
                          };
                };
            };
        };
    };
    /**
     * `id`s: A node `id` hashmap representing all nodes which files should be uploaded for.
     */
    files?: { [key: string]: { [key: string]: boolean | FileClass } };
    /**
     * The nodes hashmap.
     */
    nodes?: { [key: string]: boolean | NodeObject };
    /**
     * `id`s: A node `id` hashmap representing all nodes which rights should be updated for.
     */
    rights?: { [key: string]: Right };
}

/**
 * File metadata describing the upload to be initialized.
 */
export interface FileClass {
    /**
     * Mime type of the file to upload.
     */
    contentType: string;
    /**
     * The filename as uploaded to the server and presented by the signed URL during download.
     */
    filename: string;
    /**
     * Size of the file to be uploaded in bytes
     */
    fileSize: number;
    /**
     * Intended part size in bytes in case of a multipart upload.
     */
    partSize?: number;
}

export interface NodeObject {
    /**
     * The id of the node which should be updated.
     */
    id: string;
    [property: string]:
        | Array<boolean | number | { [key: string]: unknown } | null | string>
        | boolean
        | number
        | { [key: string]: unknown }
        | null
        | string;
}

/**
 * emails: An email hashmap representing all users which rights should be updated for on the
 * given node.
 */
export interface Right {
    /**
     * Represents right inheritance for the given node from another node denoted in the `from`
     * property. All rights of the given node are deleted and copied from the other node.
     */
    inherit?: Inherit;
    user?: { [key: string]: User };
}

/**
 * Represents right inheritance for the given node from another node denoted in the `from`
 * property. All rights of the given node are deleted and copied from the other node.
 */
export interface Inherit {
    /**
     * the node id of the node from which the rights should be copied.
     */
    from: string;
}

/**
 * rights: A right hashmap representing all rights which should be updated for the given
 * user on the given node.
 */
export interface User {
    /**
     * `true` to allow, `false` to disallow
     */
    admin?: boolean;
    /**
     * `true` to allow, `false` to disallow
     */
    read?: boolean;
    /**
     * `true` to allow, `false` to disallow
     */
    write?: boolean;
}

export interface CompleteUploadInput {
    partEtags: string[];
    uploadId: string;
}

export interface LoginInitInput {
    /**
     * Email of the user to be logged in.
     */
    email: string;
    /**
     * Client SRP A value that will be used to initiate an SRP auth process.
     */
    srpA: string;
}

export interface LoginInitOutput {
    /**
     * Name of server side pool that is used by the hash algorithm on the client side to
     * calculate the signature.
     */
    poolname: string;
    /**
     * Random salt that is used by the hash algorithm on the client side to calculate the
     * signature.
     */
    salt: string;
    /**
     * Secret block of the server. It must be sent along with the signature via the Login Verify
     * operation in order for the server to remember the session. It is also used by the hash
     * algorithm on the client side to calculate the signature.
     */
    secretBlock: string;
    /**
     * Servers SRP B value that is used by the hash algorithm on the client side to calculate
     * the signature.
     */
    srpB: string;
    /**
     * Server side UUID identifying the user during the SRP process.
     */
    userId: string;
}

export interface LoginVerifyInput {
    /**
     * Server secret block which was returned by the Login Init operation. It needs to be sent
     * along with the signature in order for the server to remember the session.
     */
    secretBlock: string;
    /**
     * Client signature that is used by the server to verify that the client knows the password.
     */
    signature: string;
    /**
     * Timestamp of the moment when the signature was calculated. It is part of the signature
     * and is also used to verify it.
     */
    timestamp: string;
    /**
     * ID of the user to be logged in. It is returned by the Login Init operation.
     */
    userId: string;
}

export interface LoginVerifyOutput {
    /**
     * OAuth access token. It can be used as Authorization header along with all Got API calls.
     */
    accessToken?: string;
    /**
     * The expiration period of the authentication result in seconds.
     */
    expiresIn?: number;
    /**
     * OAuth ID token. Never send it along with unknown API calls.
     */
    idToken?: string;
    /**
     * The refresh token which can be stored in the session and be used to restore auth tokens
     * via Login Refresh operation.
     */
    refreshToken?: string;
}

export interface LoginRefreshInput {
    /**
     * The refresh token can be used instead to retrieve new access tokens.
     */
    refreshToken: string;
}

export interface LoginRefreshOutput {
    /**
     * OAuth access token. It can be used as Authorization header along with all Got API calls.
     */
    accessToken?: string;
    /**
     * The expiration period of the authentication result in seconds.
     */
    expiresIn?: number;
    /**
     * OAuth ID token. Never send it along with unknown API calls.
     */
    idToken?: string;
}

export interface RegisterInitInput {
    /**
     * Email of the user to be registered.
     */
    email: string;
    /**
     * Password of the user to be registered.
     */
    password: string;
}

export interface RegisterVerifyInput {
    /**
     * Email of the user to be registerVerifyd.
     */
    email: string;
    /**
     * Verification code that was sent to the given email.
     */
    verificationCode: string;
}

export interface RegisterVerifyResendInput {
    /**
     * Email of the user which the verification code should be resent for.
     */
    email: string;
}

export interface ResetPasswordInitInput {
    /**
     * Email of the user which wants to reset the password.
     */
    email: string;
}

export interface ResetPasswordVerifyInput {
    /**
     * E-mail of the user for whom the password is to be reset.
     */
    email: string;
    /**
     * Current password of the user.
     */
    oldPassword?: string;
    /**
     * New password to be set.
     */
    password: string;
    /**
     * Verification code that was sent to the email after Reset Password Init operation.
     */
    verificationCode?: string;
}

export interface ResetPasswordVerifyOutput {}

export interface InviteUserInput {
    /**
     * Email of the user to be invited.
     */
    email: string;
    /**
     * Id of the node the executing user wants to use for rights validation.
     */
    id?: string;
    /**
     * optional password of the new user. This field is ignored but reserved for future use.
     */
    password?: string;
    /**
     * Identifier of the email template that will be used to send credentials to the invited
     * user.
     */
    templateId?: string;
}

export interface DeleteUserInput {
    /**
     * Email of the user to be deleted.
     */
    email: string;
}

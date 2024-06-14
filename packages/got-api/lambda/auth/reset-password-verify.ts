import {
    CORS_HEADERS,
    InvalidEmailError,
    InvalidPasswordError,
    PasswordResetMissingParamError,
    UserMissingPasswordChallengeError,
    UserNotFoundError,
    UserNotVerifiedError,
    VerificationCodeExpiredError,
    VerificationCodeMismatchError,
    cognitoAdminInitiateAuthPassword,
    cognitoConfirmForgotPassword,
    cognitoGetUser,
    cognitoRespondToPasswordChallenge,
    internalServerError,
    matchDigits,
    matchEmail,
    validate,
    type ValidationResult,
} from '@gothub/aws-util';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const AUTHENTICATED = false;

export const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'E-mail of the user for whom the password is to be reset.',
        },
        password: {
            type: 'string',
            description: 'New password to be set.',
        },
        oldPassword: {
            type: 'string',
            description: 'Current password of the user.',
        },
        verificationCode: {
            type: 'string',
            description: 'Verification code that was sent to the email after Reset Password Init operation.',
        },
    },
    required: ['email', 'password'],
};

export type Body = {
    email: string;
    password: string;
    oldPassword?: string;
    verificationCode?: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email, password, oldPassword, verificationCode } = body;

    if (matchEmail(email) !== email) {
        return InvalidEmailError;
    }
    if (password.length < 8 || matchDigits(password) !== password) {
        return InvalidPasswordError;
    }
    if (!oldPassword && !verificationCode) {
        return PasswordResetMissingParamError;
    }

    try {
        if (verificationCode) {
            await cognitoConfirmForgotPassword(email, password, verificationCode);

            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: 'Success.' }),
            };
        }

        const { UserStatus } = await cognitoGetUser(email);
        if (UserStatus !== 'FORCE_CHANGE_PASSWORD') {
            return UserMissingPasswordChallengeError;
        }

        const { session } = await cognitoAdminInitiateAuthPassword(email, oldPassword as string);

        if (!session) {
            return PasswordResetMissingParamError; // TODO: Better error
        }

        const result = await cognitoRespondToPasswordChallenge(email, password, session);

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };
    } catch (err) {
        switch ((err as Error).name) {
            case 'CodeMismatchException':
                return VerificationCodeMismatchError;
            case 'ExpiredCodeException':
                return VerificationCodeExpiredError;
            case 'UserNotVerifiedError':
                return UserNotVerifiedError;
            case 'UserNotFoundException':
                return UserNotFoundError;
            default:
                return internalServerError(err as Error);
        }
    }
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const validationResult = await validate<Body>(schema, event, { auth: AUTHENTICATED });
        const result = await handle(validationResult);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

// export const handleInvoke: Handler = async ({ body }) => {
//     try {
//         const result = await handle(body as ValidationResult<Body>);
//         return result;
//     } catch (err) {
//         return internalServerError(err as Error);
//     }
// };

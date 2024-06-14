import {
    CORS_HEADERS,
    InvalidEmailError,
    UserNotFoundError,
    VerificationCodeExpiredError,
    VerificationCodeMismatchError,
    cognitoConfirmSignup,
    internalServerError,
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
            description: 'Email of the user to be registerVerifyd.',
        },
        verificationCode: {
            type: 'string',
            description: 'Verification code that was sent to the given email.',
        },
    },
    required: ['email', 'verificationCode'],
};

export type Body = {
    email: string;
    verificationCode: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email, verificationCode } = body;
    if (matchEmail(email) !== email) {
        return InvalidEmailError;
    }
    try {
        await cognitoConfirmSignup(email, verificationCode);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Success.' }),
        };
    } catch (err) {
        switch (err.name) {
            case 'CodeMismatchException':
                return VerificationCodeMismatchError;
            case 'ExpiredCodeException':
                return VerificationCodeExpiredError;
            case 'UserNotFoundException':
                return UserNotFoundError;
            default:
                return internalServerError(err);
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

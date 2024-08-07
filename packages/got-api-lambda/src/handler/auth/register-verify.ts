import {
    CORS_HEADERS,
    InvalidEmailError,
    UserNotFoundError,
    VerificationCodeExpiredError,
    VerificationCodeMismatchError,
    internalServerError,
    matchEmail,
} from '@gothub/aws-util';
import { cognitoConfirmSignup } from '@gothub/aws-util/cognito';
import { validateBody, type ValidationResult } from '@gothub/aws-util/validation';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

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
        switch ((err as Error).name) {
            case 'CodeMismatchException':
                return VerificationCodeMismatchError;
            case 'ExpiredCodeException':
                return VerificationCodeExpiredError;
            case 'UserNotFoundException':
                return UserNotFoundError;
            default:
                return internalServerError(err as Error);
        }
    }
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const validationResult = await validateBody<Body>(schema, event);
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

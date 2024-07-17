import {
    CORS_HEADERS,
    InvalidEmailError,
    UserNotFoundError,
    UserNotVerifiedError,
    internalServerError,
    matchEmail,
    validate,
    type ValidationResult,
} from '@gothub/aws-util';
import { cognitoForgotPassword } from '@gothub/aws-util/cognito';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const AUTHENTICATED = false;

export const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'Email of the user which wants to reset the password.',
        },
    },
    required: ['email'],
};

export type Body = {
    email: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email } = body;
    if (matchEmail(email) !== email) {
        return InvalidEmailError;
    }
    try {
        await cognitoForgotPassword(email);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Success.' }),
        };
    } catch (err) {
        switch ((err as Error).name) {
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

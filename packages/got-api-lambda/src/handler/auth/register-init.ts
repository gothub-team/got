import {
    CORS_HEADERS,
    InvalidEmailError,
    InvalidPasswordError,
    UserExistsError,
    internalServerError,
    matchDigits,
    matchEmail,
} from '@gothub/aws-util';
import { cognitoSignup } from '@gothub/aws-util/cognito';
import { validateBody, type ValidationResult } from '@gothub/aws-util/validation';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'Email of the user to be registered.',
        },
        password: {
            type: 'string',
            description: 'Password of the user to be registered.',
        },
    },
    required: ['email', 'password'],
};

export type Body = {
    email: string;
    password: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email, password } = body;
    // TODO: Reject admin emails
    if (matchEmail(email) !== email) {
        return InvalidEmailError;
    }
    if (password.length < 8 || matchDigits(password) !== password) {
        return InvalidPasswordError;
    }

    try {
        await cognitoSignup(email, password);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'User was created. Check email for verification.' }),
        };
    } catch (err) {
        switch ((err as Error).name) {
            case 'UsernameExistsException':
                return UserExistsError;
            case 'InvalidPasswordException':
                return InvalidPasswordError;
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

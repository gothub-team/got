import { CORS_HEADERS, InvalidEmailError, UserNotFoundError, internalServerError, matchEmail } from '@gothub/aws-util';
import { cognitoResendConfirmationCode } from '@gothub/aws-util/cognito';
import { validateBody, type ValidationResult } from '@gothub/aws-util/validation';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'Email of the user which the verification code should be resent for.',
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
        await cognitoResendConfirmationCode(email);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Success.' }),
        };
    } catch (err) {
        switch ((err as Error).name) {
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

import {
    CORS_HEADERS,
    LoginVerifyError,
    PasswordResetRequiredError,
    UserNotFoundError,
    UserNotVerifiedError,
    internalServerError,
    validate,
    type ValidationResult,
} from '@gothub/aws-util';
import { cognitoRespondVerifySrp } from '@gothub/aws-util/cognito';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const AUTHENTICATED = false;

export const schema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            description: 'ID of the user to be logged in. It is returned by the Login Init operation.',
        },
        secretBlock: {
            type: 'string',
            description:
                'Server secret block which was returned by the Login Init operation. It needs to be sent along with the signature in order for the server to remember the session.',
        },
        signature: {
            type: 'string',
            description: 'Client signature that is used by the server to verify that the client knows the password.',
        },
        timestamp: {
            type: 'string',
            description:
                'Timestamp of the moment when the signature was calculated. It is part of the signature and is also used to verify it.',
        },
    },
    required: ['userId', 'secretBlock', 'signature', 'timestamp'],
};

export type Body = {
    userId: string;
    secretBlock: string;
    signature: string;
    timestamp: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { userId, secretBlock, signature, timestamp } = body;
    try {
        const result = await cognitoRespondVerifySrp(userId, secretBlock, signature, timestamp);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };
    } catch (err) {
        switch ((err as Error).name) {
            case 'UserNotFoundException':
                return UserNotFoundError;
            case 'UserNotConfirmedException':
                return UserNotVerifiedError;
            case 'PasswordResetRequiredException':
                return PasswordResetRequiredError;
            default:
                console.error(err);
                return LoginVerifyError;
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

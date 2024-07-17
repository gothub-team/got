import {
    CORS_HEADERS,
    InvalidRefreshTokenError,
    PasswordResetRequiredError,
    UserNotFoundError,
    UserNotVerifiedError,
    internalServerError,
    validate,
    type ValidationResult,
} from '@gothub/aws-util';
import { cognitoInitiateAuthRefreshToken } from '@gothub/aws-util/cognito';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const AUTHENTICATED = false;

export const schema = {
    type: 'object',
    properties: {
        refreshToken: {
            type: 'string',
            description: 'The refresh token can be used instead to retrieve new access tokens.',
        },
    },
    required: ['refreshToken'],
};

export type Body = {
    refreshToken: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { refreshToken } = body;
    try {
        const tokens = await cognitoInitiateAuthRefreshToken(refreshToken);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(tokens),
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
                return InvalidRefreshTokenError;
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

import {
    CORS_HEADERS,
    internalServerError,
    validate,
    matchEmail,
    InvalidEmailError,
    UserNotFoundError,
    InvalidSrpAError,
    UserNotVerifiedError,
    PasswordResetRequiredError,
    type ValidationResult,
} from '@gothub/aws-util';
import { cognitoInitiateAuthSrp } from '@gothub/aws-util/cognito';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const AUTHENTICATED = false;

export const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'Email of the user to be logged in.',
        },
        srpA: {
            type: 'string',
            description: 'Client SRP A value that will be used to initiate an SRP auth process.',
        },
    },
    required: ['email', 'srpA'],
};

export type Body = {
    email: string;
    srpA: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email, srpA } = body;

    if (matchEmail(email) !== email) {
        return InvalidEmailError;
    }
    try {
        const result = await cognitoInitiateAuthSrp(email, srpA);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(result),
        };
    } catch (err) {
        switch ((err as Error).name) {
            case 'InvalidParameterException':
                return InvalidSrpAError;
            case 'UserNotFoundException':
                return UserNotFoundError;
            case 'UserNotConfirmedException':
                return UserNotVerifiedError;
            case 'PasswordResetRequiredException':
                return PasswordResetRequiredError;
            default:
                console.error(err);
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

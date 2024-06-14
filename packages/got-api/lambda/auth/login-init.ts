import {
    CORS_HEADERS,
    internalServerError,
    validate,
    matchEmail,
    InvalidEmailError,
    cognitoInitiateAuthSrp,
} from '@gothub/aws-util';
import { type ValidationResult } from '@gothub/aws-util/src/validation';
import type { APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';

const AUTHENTICATED = false;

export const schema = {};

export type Body = {
    email: string;
    srpA: string;
};

const handle = async ({ body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email, srpA } = body;

    if (matchEmail(email) !== email) {
        return InvalidEmailError;
    }
    const result = await cognitoInitiateAuthSrp(email, srpA);
    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(result),
    };
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const validationResult = await validate<Body>(schema, event, { auth: AUTHENTICATED });
        return await handle(validationResult);
    } catch (err) {
        return internalServerError(err as Error);
    }
};

// export const handleInvoke: Handler = async ({ body }) =>
//     handle(body as ValidationResult<Body>).catch(internalServerError);

import { CORS_HEADERS, internalServerError, validate } from '@gothub/aws-util';
import { type ValidationResult } from '@gothub/aws-util/src/validation';
import type { APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';

const AUTHENTICATED = true;

export const schema = {};

export type Body = {};

const handle = async ({ userEmail, asAdmin, asRole, body }: ValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({}),
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

export const handleInvoke: Handler = async ({ body }) =>
    handle(body as ValidationResult<Body>).catch(internalServerError);

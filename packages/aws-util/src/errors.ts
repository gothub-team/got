import type { APIGatewayProxyResult } from 'aws-lambda';
import { CORS_HEADERS } from './util';

type HttpError = {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
};

export const forbidden = (err: Error | string): APIGatewayProxyResult => ({
    statusCode: 403,
    headers: CORS_HEADERS,
    body: typeof err === 'string' ? err : JSON.stringify(err),
});

export const badRequest = (err: Error | string): APIGatewayProxyResult => ({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: typeof err === 'string' ? err : JSON.stringify(err),
});

export const unauthorized = (err?: Error): APIGatewayProxyResult => ({
    statusCode: 401,
    headers: CORS_HEADERS,
    body: err ? JSON.stringify(err) : 'Unauthorized',
});

export const notFound = (err: Error): APIGatewayProxyResult => ({
    statusCode: 404,
    headers: CORS_HEADERS,
    body: err ? JSON.stringify(err) : 'Not Found',
});

export const unprocessableEntity = (err: Error): APIGatewayProxyResult => ({
    statusCode: 422,
    headers: CORS_HEADERS,
    body: err ? JSON.stringify(err) : 'Unprocessable Entity',
});

export const internalServerError = (err: Error | HttpError): APIGatewayProxyResult => {
    if ((err as HttpError).statusCode) return err as APIGatewayProxyResult;
    console.error(err);
    return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: (err as Error).message,
    };
};

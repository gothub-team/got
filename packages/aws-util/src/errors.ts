import { CORS_HEADERS } from './util';

type HttpError = {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
};

export const forbidden = (err: Error) => ({
    statusCode: 403,
    headers: CORS_HEADERS,
    body: JSON.stringify(err),
});

export const badRequest = (err: Error) => ({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify(err),
});

export const unauthorized = (err: Error) => ({
    statusCode: 401,
    headers: CORS_HEADERS,
    body: err ? JSON.stringify(err) : 'Unauthorized',
});

export const notFound = (err: Error) => ({
    statusCode: 404,
    headers: CORS_HEADERS,
    body: err ? JSON.stringify(err) : 'Not Found',
});

export const unprocessableEntity = (err: Error) => ({
    statusCode: 422,
    headers: CORS_HEADERS,
    body: err ? JSON.stringify(err) : 'Unprocessable Entity',
});

export const internalServerError = (err: Error | HttpError) => {
    if ((err as HttpError).statusCode) return err;
    console.error(err);
    return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: (err as Error).message,
    };
};

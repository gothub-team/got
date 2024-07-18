import { CORS_HEADERS, internalServerError } from '@gothub/aws-util';
import { s3get, s3list } from '@gothub/aws-util/s3';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BUCKET_LOGS } from '../push/config';
import { validateAuthed, type AuthedValidationResult } from '@gothub/aws-util/validation';

export const schema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'The id of the log to retrieve.',
        },
        prefix: {
            type: 'string',
            description: 'The prefix of the log to retrieve.',
        },
    },
};

export type Body = {
    id?: string;
    prefix?: string;
};

const handle = async ({ userEmail, body }: AuthedValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { id, prefix = '' } = body;
    if (id) {
        try {
            const log = await s3get(BUCKET_LOGS, `push/${userEmail}/${id}`);
            return {
                statusCode: 200,
                headers: CORS_HEADERS,
                body: JSON.stringify(log),
            };
        } catch (err) {
            console.error(err);
            return {
                statusCode: 404,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: 'Log not found' }),
            };
        }
    }

    const logs = await s3list(BUCKET_LOGS, `push/${userEmail}/${prefix}`).then((contents) => {
        const res = [];
        for (let i = 0; i < contents.length; i++) {
            const content = contents[i];
            if (!content || !content.Key) continue;

            res.push(content.Key.replace(`push/${userEmail}/`, ''));
        }

        return res;
    });
    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(logs),
    };
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const validationResult = await validateAuthed<Body>(schema, event);
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

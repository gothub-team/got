import { CORS_HEADERS, internalServerError } from '@gothub/aws-util';
import { S3Storage } from '@gothub/aws-util/s3';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { BUCKET_LOGS } from '../push/config';
import { validateAuthed, type AuthedValidationResult } from '@gothub/aws-util/validation';
import { PushLogsService } from '../shared/push-logs.service';

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

    const storage = new S3Storage();
    const logsService = new PushLogsService(storage, {
        LOGS: BUCKET_LOGS,
    });
    if (id) {
        const log = await logsService.getPushLog(userEmail, id);
        if (log === undefined) {
            return {
                statusCode: 404,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: 'Log not found' }),
            };
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: log?.toString() ?? '{}',
        };
    }

    const logs = await logsService.listPushLogs(userEmail, prefix);
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

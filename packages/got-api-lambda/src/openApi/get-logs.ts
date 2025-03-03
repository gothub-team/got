import { schema } from '../handler/get-logs';

export const getLogsApi = {
    summary: 'Get Push Logs',
    security: [{ BearerAuth: [] }],
    description: 'This operation either gets a specific log or lists all logs with a specific prefix.',
    operationId: 'get-logs',
    responses: {
        200: {
            description: 'OK',
        },
        400: {
            description: 'Bad Request',
        },
        401: {
            description: 'Unauthorized',
        },
    },
    requestBody: {
        content: {
            'application/json': { schema: schema },
        },
    },
};

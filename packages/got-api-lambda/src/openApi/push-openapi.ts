import { schema } from '../handler/push';

export const pushOpenApi = {
    summary: 'Push Graph',
    security: [{ BearerAuth: [] }],
    description: 'This operation pushes the graph from the request body into the database.',
    operationId: 'push',
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

import { schema } from '../../handler/auth/invite-user';

export const authInviteUserOpenApi = {
    summary: 'Invite User',
    security: [{ BearerAuth: [] }],
    description: 'This operation creates a user with the given email provided they do not exist yet.',
    operationId: 'inviteUser',
    tags: ['Auth'],
    responses: {
        201: {
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
            'application/json': {
                schema: schema,
            },
        },
    },
};

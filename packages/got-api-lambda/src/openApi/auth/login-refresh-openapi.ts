import {
    InvalidRefreshTokenError,
    PasswordResetRequiredError,
    UserNotFoundError,
    UserNotVerifiedError,
} from '@gothub/aws-util';
import { schema } from '../../handler/auth/login-refresh';

export const authLoginRefreshOpenApi = {
    summary: 'Login Refresh',
    description:
        'This operation executes a user login using a refresh token and returns all auth tokens in case of success.',
    operationId: 'loginRefresh',
    tags: ['Auth'],
    responses: {
        200: {
            description: 'OK',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            accessToken: {
                                type: 'string',
                                description:
                                    'OAuth access token. It can be used as Authorization header along with all Got API calls.',
                            },
                            expiresIn: {
                                type: 'string',
                                description: 'The expiration period of the authentication result in seconds.',
                            },
                            idToken: {
                                type: 'string',
                                description: 'OAuth ID token. Never send it along with any API calls.',
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        enum: [InvalidRefreshTokenError],
                    },
                },
            },
        },
        403: {
            description: 'Forbidden',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        enum: [UserNotVerifiedError, PasswordResetRequiredError],
                    },
                },
            },
        },
        404: {
            description: 'Not Found',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        enum: [UserNotFoundError],
                    },
                },
            },
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

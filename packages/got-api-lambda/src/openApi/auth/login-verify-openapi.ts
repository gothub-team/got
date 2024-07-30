import {
    LoginVerifyError,
    PasswordResetRequiredError,
    UserNotFoundError,
    UserNotVerifiedError,
} from '@gothub/aws-util';
import { schema } from '../../handler/auth/login-verify';

export const authLoginVerifyOpenApi = {
    summary: 'Login Verify',
    description:
        'This operation executes a user login using an SRP signature calculated by the client and returns all auth tokens in case of success.',
    operationId: 'loginVerify',
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
                                type: 'number',
                                description: 'The expiration period of the authentication result in seconds.',
                            },
                            idToken: {
                                type: 'string',
                                description: 'OAuth ID token. Never send it along with any API calls.',
                            },
                            refreshToken: {
                                type: 'string',
                                description:
                                    'The refresh token which can be stored in the session and be used to restore auth tokens via Login Refresh operation.',
                            },
                        },
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
                        enum: [LoginVerifyError, UserNotVerifiedError, PasswordResetRequiredError],
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

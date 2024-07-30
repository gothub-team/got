import {
    InvalidEmailError,
    InvalidSrpAError,
    PasswordResetRequiredError,
    UserNotFoundError,
    UserNotVerifiedError,
} from '@gothub/aws-util';
import { schema } from '../../handler/auth/login-init';

export const authLoginInitOpenApi = {
    summary: 'Login Init',
    description:
        'This operation initiates a user login with a client generated SRP A value and returns challenge parameters needed to calculate the signature. The signature is then sent back to the server using the Login Verify operation.',
    operationId: 'loginInit',
    tags: ['Auth'],
    responses: {
        200: {
            description: 'OK',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            poolname: {
                                type: 'string',
                                description:
                                    'Name of server side pool that is used by the hash algorithm on the client side to calculate the signature.',
                            },
                            userId: {
                                type: 'string',
                                description: 'Server side UUID identifying the user during the SRP process.',
                            },
                            srpB: {
                                type: 'string',
                                description:
                                    'Servers SRP B value that is used by the hash algorithm on the client side to calculate the signature.',
                            },
                            secretBlock: {
                                type: 'string',
                                description:
                                    'Secret block of the server. It must be sent along with the signature via the Login Verify operation in order for the server to remember the session. It is also used by the hash algorithm on the client side to calculate the signature.',
                            },
                            salt: {
                                type: 'string',
                                description:
                                    'Random salt that is used by the hash algorithm on the client side to calculate the signature.',
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
                        enum: [InvalidEmailError, InvalidSrpAError],
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
        500: {
            description: 'Internal Server Error',
        },
    },
    requestBody: {
        content: {
            'application/json': {
                schema,
            },
        },
    },
};

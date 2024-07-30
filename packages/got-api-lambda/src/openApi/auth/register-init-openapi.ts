import { InvalidEmailError, InvalidPasswordError, UserExistsError } from '@gothub/aws-util';
import { schema } from '../../handler/auth/register-init';

export const authRegisterInitOpenApi = {
    summary: 'Register Init',
    description:
        'This operation registers a new user with the API in order for him to authenticate for all API operations.',
    operationId: 'registerInit',
    tags: ['Auth'],
    responses: {
        200: {
            description: 'OK',
        },
        400: {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        enum: [InvalidEmailError, InvalidPasswordError],
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
                        enum: [UserExistsError],
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
                schema: schema,
            },
        },
    },
};

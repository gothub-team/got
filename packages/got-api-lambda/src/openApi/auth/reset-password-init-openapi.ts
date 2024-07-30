import { InvalidEmailError, UserNotFoundError, UserNotVerifiedError } from '@gothub/aws-util';
import { schema } from '../../handler/auth/reset-password-init';

export const authResetPasswordInitOpenApi = {
    summary: 'Reset Password Init',
    description:
        'This operation initiates the forgot password procedure. An email with verification code is sent automatically to the users email.',
    operationId: 'resetPasswordInit',
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
                        enum: [InvalidEmailError],
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
                        enum: [UserNotVerifiedError],
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
                schema: schema,
            },
        },
    },
};

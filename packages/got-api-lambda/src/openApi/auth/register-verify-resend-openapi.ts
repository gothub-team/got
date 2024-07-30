import { InvalidEmailError, UserNotFoundError } from '@gothub/aws-util';
import { schema } from '../../handler/auth/register-verify-resend';

export const authRegisterVerifyResendOpenApi = {
    summary: 'Register Verify Resend',
    description: 'This operation resends the verification code for a previously registered but not yet verified user.',
    operationId: 'registerVerifyResend',
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

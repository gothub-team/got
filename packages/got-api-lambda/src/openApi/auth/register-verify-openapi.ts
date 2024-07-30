import {
    InvalidEmailError,
    UserNotFoundError,
    VerificationCodeExpiredError,
    VerificationCodeMismatchError,
} from '@gothub/aws-util';
import { schema } from '../../handler/auth/register-verify';

export const authRegisterVerifyOpenApi = {
    summary: 'Register Verify',
    description:
        'This operation verifies a previously registered user with an verification code that was sent to his email after the register operation.',
    operationId: 'registerVerify',
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
                        enum: [InvalidEmailError, VerificationCodeMismatchError],
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
                        enum: [VerificationCodeExpiredError],
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

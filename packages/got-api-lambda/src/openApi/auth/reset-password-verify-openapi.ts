import {
    InvalidEmailError,
    InvalidPasswordError,
    UserNotFoundError,
    UserNotVerifiedError,
    VerificationCodeExpiredError,
    VerificationCodeMismatchError,
} from '@gothub/aws-util';
import { schema } from '../../handler/auth/reset-password-verify';

export const authResetPasswordVerifyOpenApi = {
    summary: 'Reset Password Verify',
    description:
        'This operation resets the password of the given user using the email address and verification code sent to this email address after calling the Reset Password Init operation.',
    operationId: 'resetPasswordVerify',
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
                        enum: [InvalidEmailError, InvalidPasswordError, VerificationCodeMismatchError],
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
                        enum: [VerificationCodeExpiredError, UserNotVerifiedError],
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

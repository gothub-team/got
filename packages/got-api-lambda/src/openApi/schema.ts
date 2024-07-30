import { querySchema } from '../handler/pull';
import { authInviteUserOpenApi } from './auth/invite-user-openapi';
import { authLoginInitOpenApi } from './auth/login-init-openapi';
import { authLoginRefreshOpenApi } from './auth/login-refresh-openapi';
import { authLoginVerifyOpenApi } from './auth/login-verify-openapi';
import { authRegisterInitOpenApi } from './auth/register-init-openapi';
import { authRegisterVerifyOpenApi } from './auth/register-verify-openapi';
import { authRegisterVerifyResendOpenApi } from './auth/register-verify-resend-openapi';
import { authResetPasswordInitOpenApi } from './auth/reset-password-init-openapi';
import { authResetPasswordVerifyOpenApi } from './auth/reset-password-verify-openapi';
import { completeUploadOpenApi } from './completeUpload-openapi';
import { pullOpenApi } from './pull-openapi';
import { pushOpenApi } from './push-openapi';

export const openApiSchema = (apiBaseUrl = '', version = '') => ({
    openapi: '3.0.0-rc2',
    servers: [
        {
            url: apiBaseUrl,
        },
    ],
    info: {
        description: 'This is the API for a got backend which manages nodes, edges and access rights for nodes.',
        version,
        title: 'Got API',
        contact: {
            email: 'api@gothub.io',
        },
    },
    paths: {
        '/pull': {
            post: pullOpenApi,
        },
        '/push': {
            post: pushOpenApi,
        },
        '/media/complete-upload': {
            post: completeUploadOpenApi,
        },
        '/auth/login-init': {
            post: authLoginInitOpenApi,
        },
        '/auth/login-verify': {
            post: authLoginVerifyOpenApi,
        },
        '/auth/login-refresh': {
            post: authLoginRefreshOpenApi,
        },
        '/auth/register-init': {
            post: authRegisterInitOpenApi,
        },
        '/auth/register-verify': {
            post: authRegisterVerifyOpenApi,
        },
        '/auth/register-verify-resend': {
            post: authRegisterVerifyResendOpenApi,
        },
        '/auth/reset-password-init': {
            post: authResetPasswordInitOpenApi,
        },
        '/auth/reset-password-verify': {
            post: authResetPasswordVerifyOpenApi,
        },
        '/auth/invite-user': {
            post: authInviteUserOpenApi,
        },
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Query: querySchema({
                $ref: '#/components/schemas/Query',
            }),
        },
    },
});

import { createApi, type GotApi } from '@gothub/got-api';
import { env } from '../env';
import crypto from 'crypto';

export const createAdminApi = async () => {
    if (!env.TEST_ADMIN_PW) {
        throw new Error('TEST_ADMIN_PW is not set');
    }
    const adminApi = createApi({
        host: env.GOT_API_URL,
        adminMode: true,
        sessionExpireTime: 1000 * 60 * 20,
    });
    await adminApi.login({
        email: env.TEST_ADMIN_USER_EMAIL,
        password: env.TEST_ADMIN_PW,
    });
    return adminApi;
};

export const createNewUserApi = async (adminApi: GotApi, userEmail: string) => {
    const password = crypto.randomBytes(8).toString('hex');
    const session = await adminApi.inviteUser({ email: userEmail, password });
    const api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    api.setCurrentSession(session);
    return api;
};

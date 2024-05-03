import { createApi } from '@gothub/got-api';
import { env } from '../env';

export const createUserApi = async (email: string, password: string) => {
    const api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    await api.login({
        email,
        password,
    });
    return api;
};

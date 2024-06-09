import { createApi } from '@gothub/got-api';
import { GOT_API_URL, parseEnv } from '@gothub/typescript-util';

const env = parseEnv({
    GOT_API_URL,
});

export const createUserApi = async (email: string, password: string, adminMode: boolean = false) => {
    console.log(env.GOT_API_URL);
    const api = createApi({
        host: env.GOT_API_URL,
        adminMode,
        sessionExpireTime: 1000 * 60 * 5,
    });
    await api.login({
        email,
        password,
    });
    return api;
};

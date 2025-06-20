import crypto from 'crypto';
import { GOT_API_URL, parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW, TEST_USER_2_EMAIL, TEST_USER_2_PW } from '../../env';
import type { TestFixture } from './fixture.type';
import { createApi, type GotApi } from '@gothub/got-api';

export class RemoteTestFixture implements TestFixture {
    testId: string;
    user1Api: GotApi;
    user1Email: string;
    user2Api: GotApi;
    user2Email: string;

    constructor() {
        const env = parseEnv({
            GOT_API_URL,
            TEST_USER_1_EMAIL,
            TEST_USER_2_EMAIL,
        });

        this.user1Email = env.TEST_USER_1_EMAIL;
        this.user1Api = createApi({
            host: env.GOT_API_URL,
            adminMode: false,
            sessionExpireTime: 1000 * 60 * 5,
        });
        this.user2Email = env.TEST_USER_2_EMAIL;

        this.user2Api = createApi({
            host: env.GOT_API_URL,
            adminMode: false,
            sessionExpireTime: 1000 * 60 * 5,
        });

        this.testId = this.newTestId();
    }

    async setup() {
        const env = parseEnv({
            TEST_USER_1_EMAIL,
            TEST_USER_1_PW,
            TEST_USER_2_EMAIL,
            TEST_USER_2_PW,
        });
        await this.user1Api.login({
            email: env.TEST_USER_1_EMAIL,
            password: env.TEST_USER_1_PW,
        });
        await this.user2Api.login({
            email: env.TEST_USER_2_EMAIL,
            password: env.TEST_USER_2_PW,
        });
    }

    newTestId() {
        return `test-${crypto.randomBytes(8).toString('hex')}`;
    }

    setTestId() {
        this.testId = this.newTestId();
    }
}

import crypto from 'crypto';
import { GOT_API_URL, parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_2_EMAIL } from '../../env';
import type { TestFixture } from './fixture.type';
import { type GotApi } from '@gothub/got-api';
import type { Graph, PushResult, View } from '@gothub/got-core';

const createLocalApi = (userEmail: string) => {
    const post = async <T>(url: string, data: unknown, headers?: Record<string, string>) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-test-user': userEmail,
                ...(headers || {}),
            },
            body: JSON.stringify(data),
        });

        return response.json() as Promise<T>;
    };

    const push = (graph: Graph, asRole: string | undefined) => {
        return post<PushResult>('http://localhost:4000/push', graph, {
            'x-as-role': asRole || 'user',
        });
    };

    const pull = (view: View) => {
        return post<Graph>('http://localhost:4000/pull', view);
    };

    const getLogs = (body: { id?: string; prefix?: string }) => {
        return post<string[] | string>('http://localhost:4000/get-logs', body);
    };

    return {
        push,
        pull,
        getLogs,
    } as GotApi;
};

export class LocalTestFixture implements TestFixture {
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
        this.user1Api = createLocalApi(env.TEST_USER_1_EMAIL);

        this.user2Email = env.TEST_USER_2_EMAIL;
        this.user2Api = createLocalApi(env.TEST_USER_2_EMAIL);

        this.testId = this.newTestId();
    }

    async setup() {}

    newTestId() {
        return `test-${crypto.randomBytes(8).toString('hex')}`;
    }

    setTestId() {
        this.testId = this.newTestId();
    }
}

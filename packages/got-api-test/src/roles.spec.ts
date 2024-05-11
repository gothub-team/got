import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph } from '@gothub/got-core';
import { createUserApi } from './shared';
import { env } from '../env';

let testId: string;
let user1Api: GotApi;
let user1Email: string;
let user2Api: GotApi;
let user2Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);
    user2Email = env.TEST_USER_2_EMAIL;
    user2Api = await createUserApi(user2Email, env.TEST_USER_2_PW);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('roles', () => {
    let graph: Graph;
    let scopeId: string;
    beforeEach(async () => {
        scopeId = `${testId}-scope.`;
        await user1Api.push({
            nodes: { [testId]: { id: testId } },
        });
    });

    describe('public role exists', () => {
        beforeEach(async () => {
            await user1Api.push({
                rights: {
                    [testId]: {},
                },
            });
        });

        it('pulls public role', () => {
            expect(graph).toHaveProperty(['roles', `${scopeId}public`, 'public'], true);
        });
    });
});

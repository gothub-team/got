import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { PushResult } from '@gothub/got-core';
import { createUserApi } from './shared';
import { parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW, TEST_USER_2_EMAIL, TEST_USER_2_PW } from '../env';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    TEST_USER_2_EMAIL,
    TEST_USER_2_PW,
});

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

describe('scopes', () => {
    let pushResult: PushResult;
    let scopeId: string;
    beforeEach(async () => {
        scopeId = `${testId}-scope.`;
    });
    describe('scope does not exist', () => {
        beforeEach(async () => {
            pushResult = await user1Api.push({
                nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
            });
        });

        it('does not push the scoped node', async () => {
            expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 403);
        });
    });

    describe('scope is pushed in same request', () => {
        beforeEach(async () => {
            pushResult = await user1Api.push({
                nodes: {
                    [scopeId]: { id: scopeId },
                    [`${scopeId}node-1`]: { id: `${scopeId}node-1` },
                },
            });
        });

        it('pushes the scope', async () => {
            expect(pushResult).toHaveProperty(['nodes', scopeId, 'statusCode'], 200);
        });
        it.todo('pushes the scoped node', async () => {
            expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 200);
        });
    });

    describe('scope exists', () => {
        beforeEach(async () => {
            await user1Api.push({
                nodes: { [scopeId]: { id: scopeId } },
            });
            pushResult = await user1Api.push({
                nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
            });
        });

        describe('default', async () => {
            it('pushes the scoped node', async () => {
                expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 200);
            });
        });

        describe('without write rights', async () => {
            beforeEach(async () => {
                pushResult = await user2Api.push({
                    nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
                });
            });

            it('does not push the scoped node', async () => {
                expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 403);
            });
        });

        describe('with write rights', async () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: { [`${scopeId}node-1`]: { user: { [user2Email]: { write: true } } } },
                });
                pushResult = await user2Api.push({
                    nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
                });
            });

            it('pushes the scoped node', async () => {
                expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 200);
            });
        });
    });
});

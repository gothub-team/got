import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { PushResult } from '@gothub/got-core';
import type { TestFixture } from './shared/fixture.type';
import { createFixture } from './shared/create-fixture';

let fixture: TestFixture;
beforeAll(async () => {
    fixture = createFixture();
    await fixture.setup();
});
beforeEach(async () => {
    fixture.setTestId();
});

describe('scopes', () => {
    let pushResult: PushResult;
    let scopeId: string;
    beforeEach(async () => {
        scopeId = `${fixture.testId}-scope.`;
    });
    describe('scope does not exist', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
                nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
            });
        });

        it('does not push the scoped node', async () => {
            expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 403);
        });
    });

    describe('scope is pushed in same request', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
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
            await fixture.user1Api.push({
                nodes: { [scopeId]: { id: scopeId } },
            });
            pushResult = await fixture.user1Api.push({
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
                pushResult = await fixture.user2Api.push({
                    nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
                });
            });

            it('does not push the scoped node', async () => {
                expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 403);
            });
        });

        describe('with write rights', async () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    rights: { [`${scopeId}node-1`]: { user: { [fixture.user2Email]: { write: true } } } },
                });
                pushResult = await fixture.user2Api.push({
                    nodes: { [`${scopeId}node-1`]: { id: `${scopeId}node-1` } },
                });
            });

            it('pushes the scoped node', async () => {
                expect(pushResult).toHaveProperty(['nodes', `${scopeId}node-1`, 'statusCode'], 200);
            });
        });
    });
});

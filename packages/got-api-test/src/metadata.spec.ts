import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph, PushResult } from '@gothub-team/got-core';
import { createUserApi } from './shared';
import { env } from '../env';

let testId: string;
let user1Api: GotApi;
let user1Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('metadata', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [`${testId}-1`]: { id: `${testId}-1` },
                [`${testId}-2`]: { id: `${testId}-2` },
            },
        });
    });

    describe('no metadata exist', () => {
        beforeEach(async () => {
            await user1Api.push({
                edges: {
                    from1: { [`${testId}-1`]: { to1: { [`${testId}-2`]: true } } },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: { edges: { 'from1/to1': { include: { edges: true, metadata: true } } } },
            });
        });

        it('pulls only true', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`], true);
        });
    });

    describe('metadata exist', () => {
        beforeEach(async () => {
            pushResult = await user1Api.push({
                edges: {
                    from1: {
                        [`${testId}-1`]: {
                            to1: {
                                [`${testId}-2`]: {
                                    strProp: 'some stuff',
                                    numProp: 42,
                                    boolProp: true,
                                },
                            },
                        },
                    },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: { edges: { 'from1/to1': { include: { edges: true, metadata: true } } } },
            });
        });

        describe('default', () => {
            it('pushes edge metadata', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'statusCode'],
                    200,
                );
            });
            it('pulls edge metadata', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'strProp'],
                    'some stuff',
                );
                expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'numProp'], 42);
                expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'boolProp'], true);
            });
        });

        describe('merge metadata', () => {
            beforeEach(async () => {
                await user1Api.push({
                    edges: {
                        from1: {
                            [`${testId}-1`]: {
                                to1: {
                                    [`${testId}-2`]: {
                                        strProp: 'new stuff',
                                        newProp: 'new prop',
                                    },
                                },
                            },
                        },
                    },
                });
                graph = await user1Api.pull({
                    [`${testId}-1`]: { edges: { 'from1/to1': { include: { edges: true, metadata: true } } } },
                });
            });

            it('pushes edge metadata', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'statusCode'],
                    200,
                );
            });
            it('pulls edge metadata', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'strProp'],
                    'new stuff',
                );
                expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'numProp'], 42);
                expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'boolProp'], true);
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`, 'newProp'],
                    'new prop',
                );
            });
        });
    });
});

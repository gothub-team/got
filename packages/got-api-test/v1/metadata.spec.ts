import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { Graph, PushResult } from '@gothub/got-core';
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

describe('metadata', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [`${fixture.testId}-1`]: { id: `${fixture.testId}-1` },
                [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
            },
        });
    });

    describe('no metadata exist', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                edges: {
                    from1: { [`${fixture.testId}-1`]: { to1: { [`${fixture.testId}-2`]: true } } },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { edges: { 'from1/to1': { include: { edges: true, metadata: true } } } },
            });
        });

        it('pulls only true', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`], true);
        });
    });

    describe('metadata exist', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
                edges: {
                    from1: {
                        [`${fixture.testId}-1`]: {
                            to1: {
                                [`${fixture.testId}-2`]: {
                                    strProp: 'some stuff',
                                    numProp: 42,
                                    boolProp: true,
                                },
                            },
                        },
                    },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { edges: { 'from1/to1': { include: { edges: true, metadata: true } } } },
            });
        });

        describe('default', () => {
            it('pushes edge metadata', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'statusCode'],
                    200,
                );
            });
            it('pulls edge metadata', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'strProp'],
                    'some stuff',
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'numProp'],
                    42,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'boolProp'],
                    true,
                );
            });
        });

        describe('merge metadata', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    edges: {
                        from1: {
                            [`${fixture.testId}-1`]: {
                                to1: {
                                    [`${fixture.testId}-2`]: {
                                        strProp: 'new stuff',
                                        newProp: 'new prop',
                                    },
                                },
                            },
                        },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [`${fixture.testId}-1`]: { edges: { 'from1/to1': { include: { edges: true, metadata: true } } } },
                });
            });

            it('pushes edge metadata', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'statusCode'],
                    200,
                );
            });
            it('pulls edge metadata', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'strProp'],
                    'new stuff',
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'numProp'],
                    42,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'boolProp'],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`, 'newProp'],
                    'new prop',
                );
            });
        });
    });
});

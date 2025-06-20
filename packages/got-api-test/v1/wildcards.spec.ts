import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { Graph } from '@gothub/got-core';
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

describe('node wildcards', () => {
    let graph: Graph;
    let scopeId: string;
    beforeEach(async () => {
        scopeId = `${fixture.testId}-scope.`;
        await fixture.user1Api.push({
            nodes: { [scopeId]: { id: scopeId } },
        });
        await fixture.user1Api.push({
            nodes: {
                [`${scopeId}node-1`]: { id: `${scopeId}node-1` },
                [`${scopeId}node-2`]: { id: `${scopeId}node-2` },
            },
        });
    });

    describe('pull nodes', () => {
        beforeEach(async () => {
            graph = await fixture.user1Api.pull({
                [`${scopeId}*`]: { include: { node: true } },
            });
        });

        it('pulls two nodes', () => {
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-1`]);
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-2`]);
        });
    });

    describe('read rights not on scope', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                rights: {
                    [`${scopeId}node-1`]: { user: { [fixture.user2Email]: { read: true } } },
                    [`${scopeId}node-2`]: { user: { [fixture.user2Email]: { read: true } } },
                },
            });
            graph = await fixture.user2Api.pull({
                [`${scopeId}*`]: { include: { node: true } },
            });
        });

        it('pulls two nodes', () => {
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-1`]);
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-2`]);
        });
    });
});

describe('edge wildcards', () => {
    let graph: Graph;
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [`${fixture.testId}-1`]: { id: `${fixture.testId}-1` },
                [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
                [`${fixture.testId}-3`]: { id: `${fixture.testId}-3` },
                [`${fixture.testId}-4`]: { id: `${fixture.testId}-4` },
                [`${fixture.testId}-5`]: { id: `${fixture.testId}-5` },
            },
            edges: {
                from1: {
                    [`${fixture.testId}-1`]: {
                        to1: {
                            [`${fixture.testId}-2`]: true,
                            [`${fixture.testId}-4`]: true,
                        },
                    },
                },
                from2: {
                    [`${fixture.testId}-1`]: {
                        to2: {
                            [`${fixture.testId}-3`]: true,
                            [`${fixture.testId}-5`]: true,
                        },
                    },
                },
            },
        });
    });

    describe('wildcard *', () => {
        beforeEach(async () => {
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: { '*': { include: { edges: true } } },
                },
            });
        });

        it('pulls 4 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${fixture.testId}-1`, 'to2', `${fixture.testId}-3`], true);
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-4`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${fixture.testId}-1`, 'to2', `${fixture.testId}-5`], true);
        });
    });

    describe('wildcard */*', () => {
        beforeEach(async () => {
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: { '*/*': { include: { edges: true } } },
                },
            });
        });

        it('pulls 4 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${fixture.testId}-1`, 'to2', `${fixture.testId}-3`], true);
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-4`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${fixture.testId}-1`, 'to2', `${fixture.testId}-5`], true);
        });
    });

    describe('illegal wildcard /*', () => {
        beforeEach(async () => {
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: { '/*': { include: { edges: true } } },
                },
            });
        });

        it('pulls no edges', () => {
            expect(graph).not.toHaveProperty(['edges', 'from1']);
            expect(graph).not.toHaveProperty(['edges', 'from2']);
        });
    });

    describe('wildcard from1/*', () => {
        beforeEach(async () => {
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: { 'from1/*': { include: { edges: true } } },
                },
            });
        });

        it('pulls 2 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-4`], true);
            expect(graph).not.toHaveProperty(['edges', 'from2']);
        });
    });

    describe('wildcard */to2', () => {
        beforeEach(async () => {
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: { '*/to2': { include: { edges: true } } },
                },
            });
        });

        it('pulls 2 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from2', `${fixture.testId}-1`, 'to2', `${fixture.testId}-3`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${fixture.testId}-1`, 'to2', `${fixture.testId}-5`], true);
            expect(graph).not.toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-2`]);
            expect(graph).not.toHaveProperty(['edges', 'from1', `${fixture.testId}-1`, 'to1', `${fixture.testId}-4`]);
        });
    });
});

import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { Graph, Node, PushResult } from '@gothub/got-core';
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

describe('nodes', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        pushResult = await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: {
                    id: fixture.testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
        graph = await fixture.user1Api.pull({
            [fixture.testId]: { include: { node: true } },
        });
    });

    describe('one node', () => {
        it('pushes one node', async () => {
            console.log('pushResult', typeof pushResult, pushResult);
            expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 200);
        });
        it('pulls the same node', async () => {
            expect(graph).toEqual({
                nodes: {
                    [fixture.testId]: {
                        id: fixture.testId,
                        name: 'Test Node',
                        prop: 'value1',
                    },
                },
            });
        });
    });

    describe('two more nodes', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-1`]: {
                        id: `${fixture.testId}-1`,
                        name: 'Test Node 1',
                        prop: 'value1',
                    },
                    [`${fixture.testId}-2`]: {
                        id: `${fixture.testId}-2`,
                        name: 'Test Node 2',
                        prop: 'value1',
                    },
                },
            });
            graph = await fixture.user1Api.pull({
                [fixture.testId]: { include: { node: true } },
                [`${fixture.testId}-1`]: { include: { node: true } },
                [`${fixture.testId}-2`]: { include: { node: true } },
            });
        });

        it('pushes two more nodes', async () => {
            expect(pushResult).toHaveProperty(['nodes', `${fixture.testId}-1`, 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['nodes', `${fixture.testId}-2`, 'statusCode'], 200);
        });
        it('pulls all three nodes', async () => {
            expect(graph).toHaveProperty(['nodes', fixture.testId, 'id'], fixture.testId);
            expect(graph).toHaveProperty(['nodes', `${fixture.testId}-1`, 'id'], `${fixture.testId}-1`);
            expect(graph).toHaveProperty(['nodes', `${fixture.testId}-2`, 'id'], `${fixture.testId}-2`);
        });
    });

    describe('update node', () => {
        describe('with old prop', () => {
            beforeEach(async () => {
                pushResult = await fixture.user1Api.push({
                    nodes: {
                        [fixture.testId]: {
                            id: fixture.testId,
                            name: 'Test Node',
                            prop: 'value2',
                        },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [fixture.testId]: { include: { node: true } },
                });
            });

            it('pushes updated node', async () => {
                expect(pushResult).toEqual({ nodes: { [fixture.testId]: { statusCode: 200 } } });
            });
            it('pulls the node with updated prop', async () => {
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'prop'], 'value2');
            });
        });

        describe('with new prop', () => {
            beforeEach(async () => {
                pushResult = await fixture.user1Api.push({
                    nodes: {
                        [fixture.testId]: {
                            id: fixture.testId,
                            newProp: 'newValue',
                        },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [fixture.testId]: { include: { node: true } },
                });
            });

            it('pushes updated node with new prop', async () => {
                expect(pushResult).toEqual({ nodes: { [fixture.testId]: { statusCode: 200 } } });
            });
            it('updated node with new prop', async () => {
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'newProp'], 'newValue');
            });
            it('keeps the old props', async () => {
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'name'], 'Test Node');
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'prop'], 'value1');
            });
        });

        describe('delete prop', () => {
            beforeEach(async () => {
                pushResult = await fixture.user1Api.push({
                    nodes: {
                        [fixture.testId]: {
                            id: fixture.testId,
                            prop: null,
                        },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [fixture.testId]: { include: { node: true } },
                });
            });

            it('pushes updated node with deleted prop', async () => {
                expect(pushResult).toEqual({ nodes: { [fixture.testId]: { statusCode: 200 } } });
            });
            it('updated node without prop', async () => {
                expect(graph).not.toHaveProperty(['nodes', fixture.testId, 'prop']);
            });
            it('keeps the other props', async () => {
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'name'], 'Test Node');
            });
        });
    });

    describe('delete node', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
                nodes: { [fixture.testId]: false },
            });
            graph = await fixture.user1Api.pull({
                [fixture.testId]: { include: { node: true } },
            });
        });

        it('pushes node in delete mode', async () => {
            expect(pushResult).toEqual({ nodes: { [fixture.testId]: { statusCode: 200 } } });
        });
        it('returns no node', async () => {
            expect(graph).toEqual({});
        });
    });

    describe('read rights', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-other`]: {
                        id: `${fixture.testId}-other`,
                        prop: 'value1',
                    },
                },
                rights: {
                    [fixture.testId]: { user: { [fixture.user2Email]: { read: true } } },
                },
            });
            graph = await fixture.user2Api.pull({
                [fixture.testId]: { include: { node: true } },
                [`${fixture.testId}-other`]: { include: { node: true } },
            });
        });

        describe('push and pull', async () => {
            it('can pull node with read right', async () => {
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'id'], fixture.testId);
            });
            it('cannot pull other node without read right', async () => {
                expect(graph).not.toHaveProperty(['nodes', `${fixture.testId}-other`]);
            });
        });

        describe('non-existing node but read right', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    rights: {
                        [fixture.testId]: { user: { [fixture.user2Email]: { read: true } } },
                    },
                });
                graph = await fixture.user2Api.pull({
                    [`${fixture.testId}-non-existing`]: { include: { node: true } },
                });
            });

            it('returns no node', async () => {
                expect(graph).toEqual({});
            });
        });
    });

    describe('write rights', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-other`]: {
                        id: `${fixture.testId}-other`,
                        prop: 'value1',
                    },
                },
                rights: {
                    [fixture.testId]: { user: { [fixture.user2Email]: { write: true } } },
                },
            });
            pushResult = await fixture.user2Api.push({
                nodes: {
                    [fixture.testId]: {
                        id: fixture.testId,
                        prop: 'value2',
                    },
                    [`${fixture.testId}-other`]: {
                        id: `${fixture.testId}-other`,
                        prop: 'value2',
                    },
                },
            });
            graph = await fixture.user1Api.pull({
                [fixture.testId]: { include: { node: true } },
                [`${fixture.testId}-other`]: { include: { node: true } },
            });
        });

        describe('push and pull', () => {
            it('can push node with write right for other user', async () => {
                expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 200);
            });
            it('cannot push other node without write right for other user', async () => {
                expect(pushResult).toHaveProperty(['nodes', `${fixture.testId}-other`, 'statusCode'], 403);
            });
            it('pulls updated node', async () => {
                expect(graph).toHaveProperty(['nodes', fixture.testId, 'prop'], 'value2');
            });
            it('keeps the other node unchanged', async () => {
                expect(graph).toHaveProperty(['nodes', `${fixture.testId}-other`, 'prop'], 'value1');
            });
        });

        describe('delete node', () => {
            beforeEach(async () => {
                pushResult = await fixture.user2Api.push({
                    nodes: {
                        [fixture.testId]: false,
                        [`${fixture.testId}-other`]: false,
                    },
                });
                graph = await fixture.user1Api.pull({
                    [fixture.testId]: { include: { node: true } },
                    [`${fixture.testId}-other`]: { include: { node: true } },
                });
            });

            it('pushes node in delete mode', async () => {
                expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 200);
                expect(pushResult).toHaveProperty(['nodes', `${fixture.testId}-other`, 'statusCode'], 403);
            });
            it('returns only node without write rights', async () => {
                expect(graph).not.toHaveProperty(['nodes', fixture.testId]);
                expect(graph).toHaveProperty(['nodes', `${fixture.testId}-other`, 'id'], `${fixture.testId}-other`);
            });
        });
    });
});

describe('big node', () => {
    let pushResult: PushResult;
    let graph: Graph;
    let node: Node;
    beforeEach(async () => {
        node = {
            id: fixture.testId,
            amount: 'gjhjhhgffgh',
            invoiceNumber: 123456,
            paid: false,
            date: 'Tue Jan 24 2023 18:56:13 GMT+0100 (Central European Standard Time)',
            info: {
                sender: 'Albert',
                recipient: 'adfgr sdfesf',
                companyInfo: 'Albertabcqweqwe\n12345 Musterstadt',
                textTop: 'some text top',
                textBottom: 'some text bottom',
                footer: [
                    'Bankverbindung: aBank IBAN: AL1234512345 BIC:1234512345',
                    'Tel.: 12345 Fax.: 1234512345 Mail: albert@mail.de',
                    'Amtsgericht: aGericht Geschäftsführer: undefined Steuernummer: 1234512345',
                ],
            },
            invoice: {
                contractTimePeriod: '01.10.2020 - 31.12.2020',
                rentTimePeriod: '01.10.2020 - 31.12.2020',
                days: '92',
                invoiceDate: '07.04.2021',
                invoiceNumber: '2019-01-01-001',
                invoiceLocation: 'Musterstadt',
                object: 'Wohnung Erdgeschoss links',
                tenant: 'adfgr sdfesf',
            },
            positions: [
                {
                    name: 'Tag Strom',
                    amount: '313 kWh',
                    unitPrice: '23.23 Rp./kWh',
                    totalPrice: '72.74 CHF',
                },
                {
                    name: 'Nacht Strom',
                    amount: '383 kWh',
                    unitPrice: '24.66 Rp./kWh',
                    totalPrice: '94.50 CHF',
                },
                {
                    name: 'Grundpreis',
                    amount: '92/365',
                    unitPrice: '50 CHF/Jahr',
                    totalPrice: '12.65 CHF',
                },
            ],
            sums: {
                net: '1000 CHF',
                vat: '190 CHF',
                gross: 'gjhjhhgffgh',
            },
        };
        pushResult = await fixture.user1Api.push({
            nodes: { [fixture.testId]: node },
        });
        graph = await fixture.user1Api.pull({
            [fixture.testId]: { include: { node: true } },
        });
    });

    it('pushes a new big node', async () => {
        expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 200);
    });
    it('pulls the same node', async () => {
        expect(graph).toEqual({
            nodes: {
                [fixture.testId]: node,
            },
        });
    });
});

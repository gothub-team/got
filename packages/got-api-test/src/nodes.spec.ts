import { describe, beforeAll, beforeEach, afterEach, it, expect } from 'bun:test';
import { env } from '../env';
import { createApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph, Node, PushResult } from '@gothub-team/got-core';

let adminApi: ReturnType<typeof createApi>;
beforeAll(async () => {
    if (!env.TEST_ADMIN_PW) {
        throw new Error('TEST_ADMIN_PW is not set');
    }
    adminApi = createApi({
        host: env.GOT_API_URL,
        adminMode: true,
        sessionExpireTime: 1000 * 60 * 20,
    });
    await adminApi.login({
        email: env.TEST_ADMIN_USER_EMAIL,
        password: env.TEST_ADMIN_PW,
    });
});

let testId: string;
let api: ReturnType<typeof createApi>;
let userEmail: string;
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
    userEmail = `aws+api.test${testId}@gothub.io`;
    const password = crypto.randomBytes(8).toString('hex');
    const session = await adminApi.inviteUser({ email: userEmail, password });
    api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    api.setCurrentSession(session);
});
afterEach(async () => {
    await adminApi.deleteUser({ email: userEmail });
});

describe('nodes', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        pushResult = await api.push({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
        graph = await api.pull({
            [testId]: {
                include: { node: true },
            },
        });
    });
    afterEach(async () => {
        await adminApi.push({ nodes: { [testId]: false } });
    });

    it('pushes one node', async () => {
        expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 200);
    });
    it('pulls the same node', async () => {
        expect(graph).toEqual({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
    });

    describe('two more nodes', () => {
        beforeEach(async () => {
            pushResult = await api.push({
                nodes: {
                    [`${testId}-1`]: {
                        id: `${testId}-1`,
                        name: 'Test Node 1',
                        prop: 'value1',
                    },
                    [`${testId}-2`]: {
                        id: `${testId}-2`,
                        name: 'Test Node 2',
                        prop: 'value1',
                    },
                },
            });
            graph = await api.pull({
                [testId]: {
                    include: { node: true },
                },
                [`${testId}-1`]: {
                    include: { node: true },
                },
                [`${testId}-2`]: {
                    include: { node: true },
                },
            });
        });
        afterEach(async () => {
            await adminApi.push({
                nodes: {
                    [`${testId}-1`]: false,
                    [`${testId}-2`]: false,
                },
            });
        });

        it('pushes two more nodes', async () => {
            expect(pushResult).toHaveProperty(['nodes', `${testId}-1`, 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['nodes', `${testId}-2`, 'statusCode'], 200);
        });
        it('pulls all three nodes', async () => {
            expect(graph).toHaveProperty(['nodes', testId, 'id'], testId);
            expect(graph).toHaveProperty(['nodes', `${testId}-1`, 'id'], `${testId}-1`);
            expect(graph).toHaveProperty(['nodes', `${testId}-2`, 'id'], `${testId}-2`);
        });
    });

    describe('update node', () => {
        describe('with old prop', () => {
            beforeEach(async () => {
                pushResult = await api.push({
                    nodes: {
                        [testId]: {
                            id: testId,
                            name: 'Test Node',
                            prop: 'value2',
                        },
                    },
                });
                graph = await api.pull({
                    [testId]: {
                        include: { node: true },
                    },
                });
            });

            it('pushes updated node', async () => {
                expect(pushResult).toEqual({ nodes: { [testId]: { statusCode: 200 } } });
            });
            it('pulls the node with updated prop', async () => {
                expect(graph).toHaveProperty(['nodes', testId, 'prop'], 'value2');
            });
        });

        describe('with new prop', () => {
            beforeEach(async () => {
                pushResult = await api.push({
                    nodes: {
                        [testId]: {
                            id: testId,
                            newProp: 'newValue',
                        },
                    },
                });
                graph = await api.pull({
                    [testId]: {
                        include: { node: true },
                    },
                });
            });

            it('pushes updated node with new prop', async () => {
                expect(pushResult).toEqual({ nodes: { [testId]: { statusCode: 200 } } });
            });
            it('updated node with new prop', async () => {
                expect(graph).toHaveProperty(['nodes', testId, 'newProp'], 'newValue');
            });
            it('keeps the old props', async () => {
                expect(graph).toHaveProperty(['nodes', testId, 'name'], 'Test Node');
                expect(graph).toHaveProperty(['nodes', testId, 'prop'], 'value1');
            });
        });

        describe('delete prop', () => {
            beforeEach(async () => {
                pushResult = await api.push({
                    nodes: {
                        [testId]: {
                            id: testId,
                            prop: null,
                        },
                    },
                });
                graph = await api.pull({
                    [testId]: {
                        include: { node: true },
                    },
                });
            });

            it('pushes updated node with deleted prop', async () => {
                expect(pushResult).toEqual({ nodes: { [testId]: { statusCode: 200 } } });
            });
            it('updated node without prop', async () => {
                expect(graph).not.toHaveProperty(['nodes', testId, 'prop']);
            });
            it('keeps the other props', async () => {
                expect(graph).toHaveProperty(['nodes', testId, 'name'], 'Test Node');
            });
        });
    });

    describe('delete node', () => {
        beforeEach(async () => {
            pushResult = await api.push({
                nodes: {
                    [testId]: false,
                },
            });
            graph = await api.pull({
                [testId]: {
                    include: { node: true },
                },
            });
        });

        it('pushes node in delete mode', async () => {
            expect(pushResult).toEqual({ nodes: { [testId]: { statusCode: 200 } } });
        });
        it('returns no node', async () => {
            expect(graph).toEqual({});
        });
    });
});

describe('big node', () => {
    let pushResult: PushResult;
    let graph: Graph;
    let node: Node;
    beforeEach(async () => {
        node = {
            id: testId,
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
        pushResult = await api.push({
            nodes: {
                [testId]: node,
            },
        });
        graph = await api.pull({
            [testId]: {
                include: { node: true },
            },
        });
    });
    afterEach(async () => {
        await adminApi.push({ nodes: { [testId]: false } });
    });

    it('pushes a new big node', async () => {
        expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 200);
    });
    it('pulls the same node', async () => {
        expect(graph).toEqual({
            nodes: {
                [testId]: node,
            },
        });
    });
});

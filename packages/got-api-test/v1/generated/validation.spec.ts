import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { env } from '../../env';
import { createUserApi } from '../shared';
import { assocPathMutate } from '@gothub/got-core';

const strictAdditionalProperties = false;
const strictLoginValidation = false;
const strictArrayValidation = false;

let headers: Record<string, string>;
beforeAll(async () => {
    const user1Api = await createUserApi(env.TEST_USER_1_EMAIL, env.TEST_USER_1_PW);
    headers = {
        Authorization: `${user1Api.getCurrentSession()?.idToken}`,
    };
});

let body: unknown;
let url: string;
let method: string;
let propPath: string[] = [];
describe('POST /pull', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}pull`;
        method = 'POST';
        body = {};
        propPath = [];
    });

    describe('additionalProperties', () => {
        beforeEach(() => {
            propPath = ['additionalProperties'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('object');
            });
        });
        describe('as', () => {
            beforeEach(() => {
                propPath = ['additionalProperties', 'as'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('string');
                });
            });
        });
        describe('role', () => {
            beforeEach(() => {
                propPath = ['additionalProperties', 'role'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('string');
                });
            });
        });
        describe('reverse', () => {
            beforeEach(() => {
                propPath = ['additionalProperties', 'reverse'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('boolean');
                });
            });
        });
        describe('edges', () => {
            beforeEach(() => {
                propPath = ['additionalProperties', 'edges'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('object');
                });
            });
        });
        describe('include', () => {
            beforeEach(() => {
                propPath = ['additionalProperties', 'include'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('object');
                });
            });
            describe('node', () => {
                beforeEach(() => {
                    propPath = ['additionalProperties', 'include', 'node'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('boolean');
                    });
                });
            });
            describe('edges', () => {
                beforeEach(() => {
                    propPath = ['additionalProperties', 'include', 'edges'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('boolean');
                    });
                });
            });
            describe('metadata', () => {
                beforeEach(() => {
                    propPath = ['additionalProperties', 'include', 'metadata'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('boolean');
                    });
                });
            });
            describe('rights', () => {
                beforeEach(() => {
                    propPath = ['additionalProperties', 'include', 'rights'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('boolean');
                    });
                });
            });
            describe('files', () => {
                beforeEach(() => {
                    propPath = ['additionalProperties', 'include', 'files'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('boolean');
                    });
                });
            });
            describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(
                        [...propPath, 'additionalProperty'],
                        { additional: 'property' },
                        body as Record<string, unknown>,
                    );
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('additionalProperties');
                });
            });
        });
        describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(
                    [...propPath, 'additionalProperty'],
                    { additional: 'property' },
                    body as Record<string, unknown>,
                );
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('additionalProperties');
            });
        });
    });
});

describe('POST /push', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}push`;
        method = 'POST';
        body = {
            nodes: {
                additionalProperties: false,
            },
            edges: {
                additionalProperties: {
                    additionalProperties: {
                        additionalProperties: {
                            additionalProperties: true,
                        },
                    },
                },
            },
            rights: {
                additionalProperties: {
                    user: {
                        additionalProperties: {
                            read: true,
                            write: true,
                            admin: true,
                        },
                    },
                    inherit: {
                        from: 'some string',
                    },
                },
            },
            files: {
                additionalProperties: {
                    additionalProperties: false,
                },
            },
        };
        propPath = [];
    });

    describe('nodes', () => {
        beforeEach(() => {
            propPath = ['nodes'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('object');
            });
        });
        describe('additionalProperties', () => {
            beforeEach(() => {
                propPath = ['nodes', 'additionalProperties'];
            });
            describe('oneOf', () => {
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('oneOf');
                    });
                });
                describe('boolean', () => {
                    beforeEach(() => {
                        assocPathMutate(propPath, false, body as Record<string, unknown>);
                    });
                });
                describe('object', () => {
                    beforeEach(() => {
                        assocPathMutate(
                            propPath,
                            { id: 'some string', additionalProperties: 'some string' },
                            body as Record<string, unknown>,
                        );
                    });
                    describe('id', () => {
                        beforeEach(() => {
                            propPath = ['nodes', 'additionalProperties', 'id'];
                        });
                        describe('wrong type', () => {
                            it('fails with bad request', async () => {
                                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                                const res = await fetch(url, {
                                    body: JSON.stringify(b),
                                    method,
                                    headers,
                                });
                                // console.log(propPath, b);
                                const resBody = await res.text();
                                expect(res).toHaveProperty('status', 400);
                                expect(resBody).toInclude('type');
                                expect(resBody).toInclude('string');
                            });
                        });
                        describe('required', () => {
                            it('fails with bad request', async () => {
                                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                                const res = await fetch(url, {
                                    body: JSON.stringify(b),
                                    method,
                                    headers,
                                });
                                // console.log(propPath, b);
                                const resBody = await res.text();
                                expect(res).toHaveProperty('status', 400);
                                expect(resBody).toInclude('required');
                                expect(resBody).toInclude('id');
                            });
                        });
                    });
                    describe('additionalProperties', () => {
                        beforeEach(() => {
                            propPath = ['nodes', 'additionalProperties', 'additionalProperties'];
                        });
                        describe('oneOf', () => {
                            describe('string', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                });
                            });
                            describe('number', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, 3.14, body as Record<string, unknown>);
                                });
                            });
                            describe('boolean', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, true, body as Record<string, unknown>);
                                });
                            });
                            describe('null', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, null, body as Record<string, unknown>);
                                });
                            });
                            describe('object', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, {}, body as Record<string, unknown>);
                                });
                            });
                            describe('array', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, ['some string'], body as Record<string, unknown>);
                                });
                                describe.todoIf(!strictArrayValidation)('item 0', () => {
                                    beforeEach(() => {
                                        propPath = ['nodes', 'additionalProperties', 'additionalProperties', '0'];
                                    });
                                    describe('oneOf', () => {
                                        describe('wrong type', () => {
                                            it('fails with bad request', async () => {
                                                const b = assocPathMutate(
                                                    propPath,
                                                    ['some array'],
                                                    body as Record<string, unknown>,
                                                );
                                                const res = await fetch(url, {
                                                    body: JSON.stringify(b),
                                                    method,
                                                    headers,
                                                });
                                                // console.log(propPath, b);
                                                const resBody = await res.text();
                                                expect(res).toHaveProperty('status', 400);
                                                expect(resBody).toInclude('type');
                                                expect(resBody).toInclude('oneOf');
                                            });
                                        });
                                        describe('string', () => {
                                            beforeEach(() => {
                                                assocPathMutate(
                                                    propPath,
                                                    'some string',
                                                    body as Record<string, unknown>,
                                                );
                                            });
                                        });
                                        describe('number', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, 3.14, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('boolean', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, true, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('null', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, null, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('object', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, {}, body as Record<string, unknown>);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    describe('edges', () => {
        beforeEach(() => {
            propPath = ['edges'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('object');
            });
        });
        describe('additionalProperties', () => {
            beforeEach(() => {
                propPath = ['edges', 'additionalProperties'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('object');
                });
            });
            describe('additionalProperties', () => {
                beforeEach(() => {
                    propPath = ['edges', 'additionalProperties', 'additionalProperties'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('object');
                    });
                });
                describe('additionalProperties', () => {
                    beforeEach(() => {
                        propPath = ['edges', 'additionalProperties', 'additionalProperties', 'additionalProperties'];
                    });
                    describe('wrong type', () => {
                        it('fails with bad request', async () => {
                            const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                            const res = await fetch(url, {
                                body: JSON.stringify(b),
                                method,
                                headers,
                            });
                            // console.log(propPath, b);
                            const resBody = await res.text();
                            expect(res).toHaveProperty('status', 400);
                            expect(resBody).toInclude('type');
                            expect(resBody).toInclude('object');
                        });
                    });
                    describe('additionalProperties', () => {
                        beforeEach(() => {
                            propPath = [
                                'edges',
                                'additionalProperties',
                                'additionalProperties',
                                'additionalProperties',
                                'additionalProperties',
                            ];
                        });
                        describe('oneOf', () => {
                            describe('wrong type', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('type');
                                    expect(resBody).toInclude('oneOf');
                                });
                            });
                            describe('boolean', () => {
                                beforeEach(() => {
                                    assocPathMutate(propPath, true, body as Record<string, unknown>);
                                });
                            });
                            describe('object', () => {
                                beforeEach(() => {
                                    assocPathMutate(
                                        propPath,
                                        { additionalProperties: 'some string' },
                                        body as Record<string, unknown>,
                                    );
                                });
                                describe('additionalProperties', () => {
                                    beforeEach(() => {
                                        propPath = [
                                            'edges',
                                            'additionalProperties',
                                            'additionalProperties',
                                            'additionalProperties',
                                            'additionalProperties',
                                            'additionalProperties',
                                        ];
                                    });
                                    describe('oneOf', () => {
                                        describe('string', () => {
                                            beforeEach(() => {
                                                assocPathMutate(
                                                    propPath,
                                                    'some string',
                                                    body as Record<string, unknown>,
                                                );
                                            });
                                        });
                                        describe('number', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, 3.14, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('boolean', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, true, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('null', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, null, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('object', () => {
                                            beforeEach(() => {
                                                assocPathMutate(propPath, {}, body as Record<string, unknown>);
                                            });
                                        });
                                        describe('array', () => {
                                            beforeEach(() => {
                                                assocPathMutate(
                                                    propPath,
                                                    ['some string'],
                                                    body as Record<string, unknown>,
                                                );
                                            });
                                            describe('item 0', () => {
                                                beforeEach(() => {
                                                    propPath = [
                                                        'edges',
                                                        'additionalProperties',
                                                        'additionalProperties',
                                                        'additionalProperties',
                                                        'additionalProperties',
                                                        'additionalProperties',
                                                        '0',
                                                    ];
                                                });
                                                describe('oneOf', () => {
                                                    describe('wrong type', () => {
                                                        it('fails with bad request', async () => {
                                                            const b = assocPathMutate(
                                                                propPath,
                                                                ['some array'],
                                                                body as Record<string, unknown>,
                                                            );
                                                            const res = await fetch(url, {
                                                                body: JSON.stringify(b),
                                                                method,
                                                                headers,
                                                            });
                                                            // console.log(propPath, b);
                                                            const resBody = await res.text();
                                                            expect(res).toHaveProperty('status', 400);
                                                            expect(resBody).toInclude('type');
                                                            expect(resBody).toInclude('oneOf');
                                                        });
                                                    });
                                                    describe('string', () => {
                                                        beforeEach(() => {
                                                            assocPathMutate(
                                                                propPath,
                                                                'some string',
                                                                body as Record<string, unknown>,
                                                            );
                                                        });
                                                    });
                                                    describe('number', () => {
                                                        beforeEach(() => {
                                                            assocPathMutate(
                                                                propPath,
                                                                3.14,
                                                                body as Record<string, unknown>,
                                                            );
                                                        });
                                                    });
                                                    describe('boolean', () => {
                                                        beforeEach(() => {
                                                            assocPathMutate(
                                                                propPath,
                                                                true,
                                                                body as Record<string, unknown>,
                                                            );
                                                        });
                                                    });
                                                    describe('null', () => {
                                                        beforeEach(() => {
                                                            assocPathMutate(
                                                                propPath,
                                                                null,
                                                                body as Record<string, unknown>,
                                                            );
                                                        });
                                                    });
                                                    describe('object', () => {
                                                        beforeEach(() => {
                                                            assocPathMutate(
                                                                propPath,
                                                                {},
                                                                body as Record<string, unknown>,
                                                            );
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    describe('rights', () => {
        beforeEach(() => {
            propPath = ['rights'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('object');
            });
        });
        describe('additionalProperties', () => {
            beforeEach(() => {
                propPath = ['rights', 'additionalProperties'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('object');
                });
            });
            describe('user', () => {
                beforeEach(() => {
                    propPath = ['rights', 'additionalProperties', 'user'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('object');
                    });
                });
                describe('additionalProperties', () => {
                    beforeEach(() => {
                        propPath = ['rights', 'additionalProperties', 'user', 'additionalProperties'];
                    });
                    describe('wrong type', () => {
                        it('fails with bad request', async () => {
                            const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                            const res = await fetch(url, {
                                body: JSON.stringify(b),
                                method,
                                headers,
                            });
                            // console.log(propPath, b);
                            const resBody = await res.text();
                            expect(res).toHaveProperty('status', 400);
                            expect(resBody).toInclude('type');
                            expect(resBody).toInclude('object');
                        });
                    });
                    describe('read', () => {
                        beforeEach(() => {
                            propPath = ['rights', 'additionalProperties', 'user', 'additionalProperties', 'read'];
                        });
                        describe('wrong type', () => {
                            it('fails with bad request', async () => {
                                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                const res = await fetch(url, {
                                    body: JSON.stringify(b),
                                    method,
                                    headers,
                                });
                                // console.log(propPath, b);
                                const resBody = await res.text();
                                expect(res).toHaveProperty('status', 400);
                                expect(resBody).toInclude('type');
                                expect(resBody).toInclude('boolean');
                            });
                        });
                    });
                    describe('write', () => {
                        beforeEach(() => {
                            propPath = ['rights', 'additionalProperties', 'user', 'additionalProperties', 'write'];
                        });
                        describe('wrong type', () => {
                            it('fails with bad request', async () => {
                                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                const res = await fetch(url, {
                                    body: JSON.stringify(b),
                                    method,
                                    headers,
                                });
                                // console.log(propPath, b);
                                const resBody = await res.text();
                                expect(res).toHaveProperty('status', 400);
                                expect(resBody).toInclude('type');
                                expect(resBody).toInclude('boolean');
                            });
                        });
                    });
                    describe('admin', () => {
                        beforeEach(() => {
                            propPath = ['rights', 'additionalProperties', 'user', 'additionalProperties', 'admin'];
                        });
                        describe('wrong type', () => {
                            it('fails with bad request', async () => {
                                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                const res = await fetch(url, {
                                    body: JSON.stringify(b),
                                    method,
                                    headers,
                                });
                                // console.log(propPath, b);
                                const resBody = await res.text();
                                expect(res).toHaveProperty('status', 400);
                                expect(resBody).toInclude('type');
                                expect(resBody).toInclude('boolean');
                            });
                        });
                    });
                    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
                        it('fails with bad request', async () => {
                            const b = assocPathMutate(
                                [...propPath, 'additionalProperty'],
                                { additional: 'property' },
                                body as Record<string, unknown>,
                            );
                            const res = await fetch(url, {
                                body: JSON.stringify(b),
                                method,
                                headers,
                            });
                            const resBody = await res.text();
                            expect(res).toHaveProperty('status', 400);
                            expect(resBody).toInclude('additionalProperties');
                        });
                    });
                });
            });
            describe('inherit', () => {
                beforeEach(() => {
                    propPath = ['rights', 'additionalProperties', 'inherit'];
                });
                describe('wrong type', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        // console.log(propPath, b);
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('type');
                        expect(resBody).toInclude('object');
                    });
                });
                describe('from', () => {
                    beforeEach(() => {
                        propPath = ['rights', 'additionalProperties', 'inherit', 'from'];
                    });
                    describe('wrong type', () => {
                        it('fails with bad request', async () => {
                            const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                            const res = await fetch(url, {
                                body: JSON.stringify(b),
                                method,
                                headers,
                            });
                            // console.log(propPath, b);
                            const resBody = await res.text();
                            expect(res).toHaveProperty('status', 400);
                            expect(resBody).toInclude('type');
                            expect(resBody).toInclude('string');
                        });
                    });
                    describe('required', () => {
                        it('fails with bad request', async () => {
                            const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                            const res = await fetch(url, {
                                body: JSON.stringify(b),
                                method,
                                headers,
                            });
                            // console.log(propPath, b);
                            const resBody = await res.text();
                            expect(res).toHaveProperty('status', 400);
                            expect(resBody).toInclude('required');
                            expect(resBody).toInclude('from');
                        });
                    });
                });
                describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
                    it('fails with bad request', async () => {
                        const b = assocPathMutate(
                            [...propPath, 'additionalProperty'],
                            { additional: 'property' },
                            body as Record<string, unknown>,
                        );
                        const res = await fetch(url, {
                            body: JSON.stringify(b),
                            method,
                            headers,
                        });
                        const resBody = await res.text();
                        expect(res).toHaveProperty('status', 400);
                        expect(resBody).toInclude('additionalProperties');
                    });
                });
            });
            describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(
                        [...propPath, 'additionalProperty'],
                        { additional: 'property' },
                        body as Record<string, unknown>,
                    );
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('additionalProperties');
                });
            });
        });
    });
    describe('files', () => {
        beforeEach(() => {
            propPath = ['files'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('object');
            });
        });
        describe('additionalProperties', () => {
            beforeEach(() => {
                propPath = ['files', 'additionalProperties'];
            });
            describe('wrong type', () => {
                it('fails with bad request', async () => {
                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                    const res = await fetch(url, {
                        body: JSON.stringify(b),
                        method,
                        headers,
                    });
                    // console.log(propPath, b);
                    const resBody = await res.text();
                    expect(res).toHaveProperty('status', 400);
                    expect(resBody).toInclude('type');
                    expect(resBody).toInclude('object');
                });
            });
            describe('additionalProperties', () => {
                beforeEach(() => {
                    propPath = ['files', 'additionalProperties', 'additionalProperties'];
                });
                describe('oneOf', () => {
                    describe('wrong type', () => {
                        it('fails with bad request', async () => {
                            const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                            const res = await fetch(url, {
                                body: JSON.stringify(b),
                                method,
                                headers,
                            });
                            // console.log(propPath, b);
                            const resBody = await res.text();
                            expect(res).toHaveProperty('status', 400);
                            expect(resBody).toInclude('type');
                            expect(resBody).toInclude('oneOf');
                        });
                    });
                    describe('boolean', () => {
                        beforeEach(() => {
                            assocPathMutate(propPath, false, body as Record<string, unknown>);
                        });
                    });
                    describe('object', () => {
                        beforeEach(() => {
                            assocPathMutate(
                                propPath,
                                {
                                    filename: 'some string',
                                    contentType: 'some string',
                                    fileSize: 100,
                                    partSize: 5242880,
                                },
                                body as Record<string, unknown>,
                            );
                        });
                        describe('filename', () => {
                            beforeEach(() => {
                                propPath = ['files', 'additionalProperties', 'additionalProperties', 'filename'];
                            });
                            describe('wrong type', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(
                                        propPath,
                                        ['some array'],
                                        body as Record<string, unknown>,
                                    );
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('type');
                                    expect(resBody).toInclude('string');
                                });
                            });
                            describe('required', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('required');
                                    expect(resBody).toInclude('filename');
                                });
                            });
                        });
                        describe('contentType', () => {
                            beforeEach(() => {
                                propPath = ['files', 'additionalProperties', 'additionalProperties', 'contentType'];
                            });
                            describe('wrong type', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(
                                        propPath,
                                        ['some array'],
                                        body as Record<string, unknown>,
                                    );
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('type');
                                    expect(resBody).toInclude('string');
                                });
                            });
                            describe('required', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('required');
                                    expect(resBody).toInclude('contentType');
                                });
                            });
                        });
                        describe('fileSize', () => {
                            beforeEach(() => {
                                propPath = ['files', 'additionalProperties', 'additionalProperties', 'fileSize'];
                            });
                            describe('wrong type', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('type');
                                    expect(resBody).toInclude('integer');
                                });
                            });
                            describe('required', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('required');
                                    expect(resBody).toInclude('fileSize');
                                });
                            });
                        });
                        describe('partSize', () => {
                            beforeEach(() => {
                                propPath = ['files', 'additionalProperties', 'additionalProperties', 'partSize'];
                            });
                            describe('wrong type', () => {
                                it('fails with bad request', async () => {
                                    const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                                    const res = await fetch(url, {
                                        body: JSON.stringify(b),
                                        method,
                                        headers,
                                    });
                                    // console.log(propPath, b);
                                    const resBody = await res.text();
                                    expect(res).toHaveProperty('status', 400);
                                    expect(resBody).toInclude('type');
                                    expect(resBody).toInclude('integer');
                                });
                            });
                        });
                        describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
                            it('fails with bad request', async () => {
                                const b = assocPathMutate(
                                    [...propPath, 'additionalProperty'],
                                    { additional: 'property' },
                                    body as Record<string, unknown>,
                                );
                                const res = await fetch(url, {
                                    body: JSON.stringify(b),
                                    method,
                                    headers,
                                });
                                const resBody = await res.text();
                                expect(res).toHaveProperty('status', 400);
                                expect(resBody).toInclude('additionalProperties');
                            });
                        });
                    });
                });
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /media/complete-upload', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}media/complete-upload`;
        method = 'POST';
        body = {
            uploadId: 'some string',
            partEtags: ['some string'],
        };
        propPath = [];
    });

    describe('uploadId', () => {
        beforeEach(() => {
            propPath = ['uploadId'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('uploadId');
            });
        });
    });
    describe('partEtags', () => {
        beforeEach(() => {
            propPath = ['partEtags'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, 'some string', body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('array');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('partEtags');
            });
        });
        describe('item 0', () => {
            beforeEach(() => {
                propPath = ['partEtags', '0'];
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/login-init', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/login-init`;
        method = 'POST';
        body = {
            email: 'some string',
            srpA: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe('srpA', () => {
        beforeEach(() => {
            propPath = ['srpA'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('srpA');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe.todoIf(!strictLoginValidation)('POST /auth/login-verify', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/login-verify`;
        method = 'POST';
        body = {
            userId: 'some string',
            secretBlock: 'some string',
            signature: 'some string',
            timestamp: 'some string',
        };
        propPath = [];
    });

    describe('userId', () => {
        beforeEach(() => {
            propPath = ['userId'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('userId');
            });
        });
    });
    describe('secretBlock', () => {
        beforeEach(() => {
            propPath = ['secretBlock'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('secretBlock');
            });
        });
    });
    describe('signature', () => {
        beforeEach(() => {
            propPath = ['signature'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('signature');
            });
        });
    });
    describe('timestamp', () => {
        beforeEach(() => {
            propPath = ['timestamp'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('timestamp');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/login-refresh', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/login-refresh`;
        method = 'POST';
        body = {
            refreshToken: 'some string',
        };
        propPath = [];
    });

    describe.todoIf(!strictLoginValidation)('refreshToken', () => {
        beforeEach(() => {
            propPath = ['refreshToken'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('refreshToken');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/register-init', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/register-init`;
        method = 'POST';
        body = {
            email: 'some string',
            password: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe('password', () => {
        beforeEach(() => {
            propPath = ['password'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('password');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/register-verify', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/register-verify`;
        method = 'POST';
        body = {
            email: 'some string',
            verificationCode: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe('verificationCode', () => {
        beforeEach(() => {
            propPath = ['verificationCode'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('verificationCode');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/register-verify-resend', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/register-verify-resend`;
        method = 'POST';
        body = {
            email: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/reset-password-init', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/reset-password-init`;
        method = 'POST';
        body = {
            email: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/reset-password-verify', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/reset-password-verify`;
        method = 'POST';
        body = {
            email: 'some string',
            password: 'some string',
            oldPassword: 'some string',
            verificationCode: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe('password', () => {
        beforeEach(() => {
            propPath = ['password'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('password');
            });
        });
    });
    describe('oldPassword', () => {
        beforeEach(() => {
            propPath = ['oldPassword'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
    });
    describe('verificationCode', () => {
        beforeEach(() => {
            propPath = ['verificationCode'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

describe('POST /auth/invite-user', () => {
    beforeEach(() => {
        url = `${env.GOT_API_URL}auth/invite-user`;
        method = 'POST';
        body = {
            email: 'some string',
            id: 'some string',
            templateId: 'some string',
        };
        propPath = [];
    });

    describe('email', () => {
        beforeEach(() => {
            propPath = ['email'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('email');
            });
        });
    });
    describe('id', () => {
        beforeEach(() => {
            propPath = ['id'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
        describe('required', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, undefined, body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('required');
                expect(resBody).toInclude('id');
            });
        });
    });
    describe('templateId', () => {
        beforeEach(() => {
            propPath = ['templateId'];
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                // console.log(propPath, b);
                const resBody = await res.text();
                expect(res).toHaveProperty('status', 400);
                expect(resBody).toInclude('type');
                expect(resBody).toInclude('string');
            });
        });
    });
    describe.todoIf(!strictAdditionalProperties)('no additional property', () => {
        it('fails with bad request', async () => {
            const b = assocPathMutate(
                [...propPath, 'additionalProperty'],
                { additional: 'property' },
                body as Record<string, unknown>,
            );
            const res = await fetch(url, {
                body: JSON.stringify(b),
                method,
                headers,
            });
            const resBody = await res.text();
            expect(res).toHaveProperty('status', 400);
            expect(resBody).toInclude('additionalProperties');
        });
    });
});

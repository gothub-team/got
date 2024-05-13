import { describe, beforeAll, beforeEach, afterEach, it, expect } from 'bun:test';
import crypto from 'crypto';
import { env } from '../../env';
import { createUserApi } from '../shared';
import { assocPathMutate } from '@gothub/got-core';

const strictAdditionalProperties = false;
const strictLoginValidation = false;

let testId: string;
let headers: Record<string, string>;
beforeAll(async () => {
    const user1Api = await createUserApi(env.TEST_USER_1_EMAIL, env.TEST_USER_1_PW);
    headers = {
        Authorization: `${user1Api.getCurrentSession()?.idToken}`,
    };
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
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
            propPath.push('additionalProperties');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('nodes');
        });
        afterEach(() => {
            propPath.pop();
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
                propPath.push('additionalProperties');
            });
            afterEach(() => {
                propPath.pop();
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
                            propPath.push('id');
                        });
                        afterEach(() => {
                            propPath.pop();
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
                            propPath.push('additionalProperties');
                        });
                        afterEach(() => {
                            propPath.pop();
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
                            });
                        });
                    });
                });
            });
        });
    });
    describe('edges', () => {
        beforeEach(() => {
            propPath.push('edges');
        });
        afterEach(() => {
            propPath.pop();
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
                propPath.push('additionalProperties');
            });
            afterEach(() => {
                propPath.pop();
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
                    propPath.push('additionalProperties');
                });
                afterEach(() => {
                    propPath.pop();
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
                        propPath.push('additionalProperties');
                    });
                    afterEach(() => {
                        propPath.pop();
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
                            propPath.push('additionalProperties');
                        });
                        afterEach(() => {
                            propPath.pop();
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
                                        propPath.push('additionalProperties');
                                    });
                                    afterEach(() => {
                                        propPath.pop();
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
            propPath.push('rights');
        });
        afterEach(() => {
            propPath.pop();
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
                propPath.push('additionalProperties');
            });
            afterEach(() => {
                propPath.pop();
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
                    propPath.push('user');
                });
                afterEach(() => {
                    propPath.pop();
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
                        propPath.push('additionalProperties');
                    });
                    afterEach(() => {
                        propPath.pop();
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
                            propPath.push('read');
                        });
                        afterEach(() => {
                            propPath.pop();
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
                            propPath.push('write');
                        });
                        afterEach(() => {
                            propPath.pop();
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
                            propPath.push('admin');
                        });
                        afterEach(() => {
                            propPath.pop();
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
                    propPath.push('inherit');
                });
                afterEach(() => {
                    propPath.pop();
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
                        propPath.push('from');
                    });
                    afterEach(() => {
                        propPath.pop();
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
            propPath.push('files');
        });
        afterEach(() => {
            propPath.pop();
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
                propPath.push('additionalProperties');
            });
            afterEach(() => {
                propPath.pop();
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
                    propPath.push('additionalProperties');
                });
                afterEach(() => {
                    propPath.pop();
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
                                propPath.push('filename');
                            });
                            afterEach(() => {
                                propPath.pop();
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
                                propPath.push('contentType');
                            });
                            afterEach(() => {
                                propPath.pop();
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
                                propPath.push('fileSize');
                            });
                            afterEach(() => {
                                propPath.pop();
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
                                propPath.push('partSize');
                            });
                            afterEach(() => {
                                propPath.pop();
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
            propPath.push('uploadId');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('partEtags');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('srpA');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('userId');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('secretBlock');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('signature');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('timestamp');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('refreshToken');
        });
        afterEach(() => {
            propPath.pop();
        });
        describe('wrong type', () => {
            it('fails with bad request', async () => {
                const b = assocPathMutate(propPath, ['some array'], body as Record<string, unknown>);
                const res = await fetch(url, {
                    body: JSON.stringify(b),
                    method,
                    headers,
                });
                console.log(propPath, b);
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
                console.log(propPath, b);
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('password');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('verificationCode');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('password');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('oldPassword');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('verificationCode');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('email');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('id');
        });
        afterEach(() => {
            propPath.pop();
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
            propPath.push('templateId');
        });
        afterEach(() => {
            propPath.pop();
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

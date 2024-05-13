import { describe, beforeAll, beforeEach, afterEach, it, expect } from 'bun:test';
import crypto from 'crypto';
import { env } from '../../env';
import { createUserApi } from '../shared';
import { assocPathMutate } from '@gothub/got-core';

const strictAdditionalProperties = false;

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

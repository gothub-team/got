import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import crypto from 'crypto';
import { env } from '../../env';
import { createUserApi } from '../shared';

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

describe('POST /pull', () => {
    const url = `${env.GOT_API_URL}pull`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /push', () => {
    const url = `${env.GOT_API_URL}push`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /media/complete-upload', () => {
    const url = `${env.GOT_API_URL}media/complete-upload`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/login-init', () => {
    const url = `${env.GOT_API_URL}auth/login-init`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/login-verify', () => {
    const url = `${env.GOT_API_URL}auth/login-verify`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/login-refresh', () => {
    const url = `${env.GOT_API_URL}auth/login-refresh`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/register-init', () => {
    const url = `${env.GOT_API_URL}auth/register-init`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/register-verify', () => {
    const url = `${env.GOT_API_URL}auth/register-verify`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/register-verify-resend', () => {
    const url = `${env.GOT_API_URL}auth/register-verify-resend`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/reset-password-init', () => {
    const url = `${env.GOT_API_URL}auth/reset-password-init`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/reset-password-verify', () => {
    const url = `${env.GOT_API_URL}auth/reset-password-verify`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});

describe('POST /auth/invite-user', () => {
    const url = `${env.GOT_API_URL}auth/invite-user`;
    it('should work', async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers,
        });
        expect(res.status).toBe(400);
    });
});


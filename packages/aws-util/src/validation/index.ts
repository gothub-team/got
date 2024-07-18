import type { Schema } from 'ajv';
import { Ajv } from 'ajv';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { decodeJwt, jsonParseOr } from '../util.js';
import { ADMIN_EMAILS } from '../config.js';
import { badRequest, unauthorized } from '../errors.js';

export type AuthedValidationResult<TBody> = {
    userEmail: string;
    asAdmin: boolean;
    asRole: string;
    body: TBody;
};
export type ValidationResult<TBody> = {
    body: TBody;
};

export const validateBody = async <TBody>(schema: Schema, event: APIGatewayProxyEvent) => {
    try {
        const body = jsonParseOr<TBody>((event.body || {}) as TBody, event.body || '');

        const ajv = new Ajv();
        ajv.addKeyword('example');
        const valid = ajv.validate(schema, body);
        if (valid) {
            return { body };
        } else {
            throw badRequest(JSON.stringify(ajv.errors));
        }
    } catch (error) {
        throw badRequest((error as Error).message);
    }
};

export const validateAuthed = async <TBody>(schema: Schema, event: APIGatewayProxyEvent) => {
    let user;
    try {
        user = decodeJwt(event.headers.Authorization || event.headers.authorization || '');
    } catch (error) {
        throw unauthorized();
    }

    try {
        const body = jsonParseOr<TBody>((event.body || {}) as TBody, event.body || '');

        const ajv = new Ajv();
        ajv.addKeyword('example');
        const valid = ajv.validate(schema, body);
        if (valid) {
            const userEmail = user.email as string;
            const asRole = event.headers['x-as-role'] || 'user';
            const asAdmin = !!event.headers['x-as-admin'] && ADMIN_EMAILS.includes(userEmail);
            return { userEmail, body, asAdmin, asRole };
        } else {
            throw badRequest(JSON.stringify(ajv.errors));
        }
    } catch (error) {
        throw badRequest((error as Error).message);
    }
};

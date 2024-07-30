import type { Schema } from 'ajv';
import { Ajv } from 'ajv';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { decodeJwt, jsonParseOr } from './util.js';
import { ADMIN_EMAILS } from './config.js';
import { badRequest, unauthorized } from './errors.js';

export type ValidationResult<TBody> = {
    userEmail?: string;
    asAdmin: boolean;
    asRole: string;
    body: TBody;
};

export const validate = <TBody>(schema: Schema, event: APIGatewayProxyEvent, { auth = true } = {}) =>
    new Promise<ValidationResult<TBody>>((resolve, reject) => {
        let user;
        try {
            if (auth) {
                user = decodeJwt(event.headers.Authorization || event.headers.authorization || '');
            } else {
                user = {};
            }
        } catch (error) {
            reject(unauthorized());
            return;
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
                resolve({ userEmail, body, asAdmin, asRole });
            } else {
                reject(badRequest(JSON.stringify(ajv.errors)));
            }
        } catch (error) {
            reject(badRequest((error as Error).message));
        }
    });

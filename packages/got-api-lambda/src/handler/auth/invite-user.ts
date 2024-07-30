import {
    CORS_HEADERS,
    INVITE_USER_VALIDATION_VIEW,
    PULL_LAMBDA_NAME,
    UserExistsError,
    internalServerError,
    nodeForbidden,
    jsonParseOr,
} from '@gothub/aws-util';
import { invokeLambda } from '@gothub/aws-util/lambda';
import { cognitoInviteUser, cognitoUserExists } from '@gothub/aws-util/cognito';
import { v4 } from 'uuid';
import type { APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { validateAuthed, type AuthedValidationResult } from '@gothub/aws-util/validation';

export const schema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            description: 'Email of the user to be invited.',
        },
        id: {
            type: 'string',
            description: 'Id of the node the executing user wants to use for rights validation.',
        },
        templateId: {
            type: 'string',
            description: 'Identifier of the email template that will be used to send credentials to the invited user.',
        },
    },
    required: ['email', 'id'],
};

export type Body = {
    email: string;
    id: string;
    templateId?: string;
};

const handle = async ({ userEmail, body, asAdmin }: AuthedValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { email, id, templateId } = body;

    const userExists = await cognitoUserExists(email);
    if (userExists) {
        return UserExistsError;
    }

    const validationView = jsonParseOr({}, INVITE_USER_VALIDATION_VIEW);
    const invokeBody = {
        userEmail,
        body: validationView,
        asAdmin,
    };
    // TODO: create got internals in aws-util
    const res = await invokeLambda<typeof invokeBody, { body: string }>(PULL_LAMBDA_NAME, invokeBody);
    const identifierGraph = res?.body ? JSON.parse(res.body) : {};
    if (!identifierGraph?.rights?.[id]?.user?.[userEmail as string]?.admin) {
        return nodeForbidden(userEmail || '', 'admin', id);
    }

    const temporaryPassword = v4().replace(/-/g, '').slice(0, 16);

    await cognitoInviteUser(email, temporaryPassword, templateId);

    return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: `User ${email} was successfully invited.` }),
    };
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const validationResult = await validateAuthed<Body>(schema, event);
        const result = await handle(validationResult);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

export const handleInvoke: Handler = async ({ body }) => {
    try {
        const result = await handle(body as AuthedValidationResult<Body>);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

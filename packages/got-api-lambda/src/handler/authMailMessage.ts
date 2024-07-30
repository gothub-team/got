import { sendMail } from '@gothub/aws-util/email';
import { badRequest, CORS_HEADERS, internalServerError, PULL_LAMBDA_NAME } from '@gothub/aws-util';
import type { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { buildClient, CommitmentPolicy, KmsKeyringNode } from '@aws-crypto/client-node';
import {
    APPLICATION_ROOT_NODE,
    createEmailTemplateView,
    DEFAULT_EMAIL_TEMPLATES,
    TEMPLATE_EDGE_TYPES,
    type Template,
    type TemplateNode,
} from '../authMailMessage/email-templates';
import { invokeLambda } from '@gothub/aws-util/lambda';
import type { Graph, View } from '@gothub/got-core';

export const CUSTOM_MAIL_MESSAGE_KEY_ARN = process.env.CUSTOM_MAIL_MESSAGE_KEY_ARN || '';

// const AUTHENTICATED = true;

// export const schema = {};

// export type Body = {};

type Request = {
    code: string;
    clientMetadata: {
        skipMessage?: string;
        templateId?: string;
    };
    userAttributes: {
        email: string;
    };
};

const decryptEventCode = async (code: string) => {
    const keyIds = [CUSTOM_MAIL_MESSAGE_KEY_ARN];
    const keyring = new KmsKeyringNode({ keyIds });

    const { decrypt } = buildClient(CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT);
    const { plaintext } = await decrypt(keyring, Buffer.from(code, 'base64'));

    return plaintext.toString();
};

const findTemplateInGraph = (templateId: string, graph: Graph): Template | undefined => {
    const nodes = graph.nodes || {};
    const values = Object.values(nodes) as TemplateNode[];
    return values.find((node) => {
        if (!node || typeof node !== 'object') return false;

        return node.templateId === templateId;
    });
};

const fetchEmailTemplate = async (triggerSource: string, templateId: string) => {
    const edgeTypes = TEMPLATE_EDGE_TYPES[triggerSource] || false;
    if (!edgeTypes) {
        throw new Error(`No edge types found for ${triggerSource}`);
    }

    const templatesView = createEmailTemplateView(APPLICATION_ROOT_NODE, edgeTypes);
    const res = await invokeLambda<{ userEmail: string; body: View; asAdmin: boolean }, { body: string }>(
        PULL_LAMBDA_NAME,
        {
            userEmail: '',
            body: templatesView,
            asAdmin: true,
        },
    );
    const graph = res?.body ? (JSON.parse(res.body) as Graph) : {};

    const template = findTemplateInGraph(templateId, graph);

    if (template) {
        return template;
    }

    const defaultTemplate = findTemplateInGraph('default', graph);

    return defaultTemplate || DEFAULT_EMAIL_TEMPLATES[triggerSource];
};

const replaceProps = (text: string, email: string, plaintext: string, encoded: string) => {
    return text
        .replace('{#encoded}', encoded)
        .replace('{#activationCode}', plaintext)
        .replace('{#password}', plaintext)
        .replace('{#email}', email);
};

const replaceTemplateProps = (template: Template, email: string, plaintext: string): Template => {
    const encoded = `${email}/${plaintext}`; // TODO

    const subject = replaceProps(template.subject, email, plaintext, encoded);
    const text = replaceProps(template.text, email, plaintext, encoded);
    const html = replaceProps(template.html, email, plaintext, encoded);

    return {
        subject,
        text,
        html,
    };
};

const getMail = async (
    triggerSource: string,
    templateId: string,
    email: string,
    plaintext: string,
): Promise<Template> => {
    const template = await fetchEmailTemplate(triggerSource, templateId);

    if (!template) {
        throw new Error(`No template found for ${triggerSource} :: ${templateId}`);
    }

    return replaceTemplateProps(template, email, plaintext);
};

const handle = async (
    skipMessage: boolean,
    triggerSource: string,
    eventCode: string,
    email: string,
    templateId: string,
): Promise<APIGatewayProxyResult> => {
    if (skipMessage) return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({}) };

    if (!eventCode) {
        return badRequest('No event code provided');
    }

    if (!email) {
        return badRequest('No email provided');
    }

    const plaintext = await decryptEventCode(eventCode);

    console.log(`Sending ${triggerSource}} mail to ${email}`);

    const mailContent = await getMail(triggerSource, templateId, email, plaintext);
    await sendMail(email, mailContent);

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({}),
    };
};

// export const handleHttp: APIGatewayProxyHandler = async (event) => {
//     try {
//         const validationResult = await validate<Body>(schema, event, { auth: AUTHENTICATED });
//         const result = await handle(validationResult);
//         return result;
//     } catch (err) {
//         return internalServerError(err as Error);
//     }
// };

export const handleInvoke: Handler = async ({
    request,
    triggerSource,
}: {
    request: Request;
    triggerSource: string;
}) => {
    try {
        const skipMessage = request?.clientMetadata?.skipMessage === 'true';
        const eventCode = request?.code;
        const email = request?.userAttributes?.email;
        const templateId = request?.clientMetadata?.templateId || 'default';

        const result = await handle(skipMessage, triggerSource, eventCode, email, templateId);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

import nodemailer, { type Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer/index.js';
import { ssmGetParameter } from './ssm';

type MailContent = {
    sender?: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Mail.Attachment[];
    replyTo?: string;
};

type recipient = string | string[];

type sendMailFn = (recipient: recipient, content: MailContent) => Promise<void>;

type decodeMailAccountFn = (mailAccountEncoded: string) => string[];

const decodeMailAccount: decodeMailAccountFn = (accountStr) => {
    const account = accountStr.split('\n')[0] || '';
    return account.split('|');
};

const getMailAccount = async () => {
    const ssmParameter = await ssmGetParameter('NOTIFICATIONS_EMAIL_ACCOUNT', true);

    if (!ssmParameter) throw new Error('Missing mail credentials');

    const mailAccountEncoded = Buffer.from(ssmParameter, 'base64').toString('utf-8');
    return decodeMailAccount(mailAccountEncoded);
};

type createTransportFn = (
    host?: string,
    user?: string,
    pass?: string,
    port?: string,
    secure?: boolean | string,
) => Promise<Transporter>;

const createTransport: createTransportFn = async (host, user, pass, port, secure) => {
    const transport = nodemailer.createTransport({
        host,
        port: parseInt(port || '587'),
        secure: !!secure,
        auth: {
            user,
            pass,
        },
    });
    await transport.verify();
    return transport;
};

export const sendMail: sendMailFn = async (to: string | string[], content: Mail.Options) => {
    const [sender, host, user, pass, port, secure] = await getMailAccount();

    const transport = await createTransport(host, user, pass, port, secure);
    await transport
        .sendMail({
            ...content,
            from: `${content.sender || sender || ''} <${user || ''}>`,
            to,
        })
        .catch(console.error);
};

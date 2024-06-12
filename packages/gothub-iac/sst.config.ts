/// <reference path="./.sst/platform/config.d.ts" />
import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as fs from 'fs';
import {
    AWS_MAIL_REGION,
    AWS_PROFILE,
    AWS_REGION,
    FILE_HOSTING_DOMAIN,
    MAIL_DOMAIN,
    parseEnv,
} from '@gothub/typescript-util';
import { FILE_HOSTING_BUCKET } from './env';

const env = parseEnv({
    AWS_REGION,
    AWS_PROFILE,
    AWS_MAIL_REGION,
    MAIL_DOMAIN,
    FILE_HOSTING_DOMAIN,
    FILE_HOSTING_BUCKET,
});

export default $config({
    app(input) {
        return {
            name: 'gothub-iac',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
            providers: {
                aws: {
                    region: env.AWS_REGION,
                    profile: env.AWS_PROFILE,
                },
            },
        };
    },
    async run() {
        const mailDomain = new gotiac.MailDomain('MailDomain', {
            domain: env.MAIL_DOMAIN,
            region: env.AWS_MAIL_REGION,
        });

        const user = new gotiac.MailUser('MailUser', {
            region: env.AWS_MAIL_REGION,
            domain: env.MAIL_DOMAIN,
            displayName: 'Info',
            name: `info@${env.MAIL_DOMAIN}`,
            emailPrefix: 'info',
            enabled: true,
        });

        fs.writeFileSync('.secrets.env', '');
        user.password.apply((password) => {
            fs.appendFileSync('.secrets.env', `export MAIL_USER_PW='${password}'\n`);
        });
        mailDomain.imapServer.apply((imapServer) => {
            fs.appendFileSync('.secrets.env', `export MAIL_IMAP_SERVER='${imapServer}'\n`);
        });
    },
});

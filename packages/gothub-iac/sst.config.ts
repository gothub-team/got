/// <reference path="./.sst/platform/config.d.ts" />
import * as pulumi from '@pulumi/pulumi';
import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as fs from 'fs';
import { env } from './env';

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
        const fileHosting = new gotiac.FileHosting('FileHosting', {
            domain: env.FILE_HOSTING_DOMAIN,
            bucketName: env.FILE_HOSTING_BUCKET,
        });

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

        return {
            url: pulumi.interpolate`https://${fileHosting.url}`,
            privateKeyId: fileHosting.privateKeyId,
            privateKeyParameterName: fileHosting.privateKeyParameterName,
        };
    },
});

/// <reference path="./.sst/platform/config.d.ts" />
import * as pulumi from '@pulumi/pulumi';
import * as gotiac from '@gothub/pulumi-gotiac-aws';
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

        const mailDomain = new gotiac.MailDomain('MailDomain', {});

        return {
            url: pulumi.interpolate`https://${fileHosting.url}`,
            privateKeyId: fileHosting.privateKeyId,
            privateKeyParameterName: fileHosting.privateKeyParameterName,
            random: pulumi.interpolate`${mailDomain.random}`,
        };
    },
});

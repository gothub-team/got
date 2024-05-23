/// <reference path="./.sst/platform/config.d.ts" />
// import * as pulumi from '@pulumi/pulumi';
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
        // const fileHosting = new gotiac.FileHosting('FileHosting', {
        //     domain: env.FILE_HOSTING_DOMAIN,
        //     bucketName: env.FILE_HOSTING_BUCKET,
        // });

        new gotiac.MailDomain('MailDomain', {
            domain: env.BASE_DOMAIN,
            region: env.AWS_MAIL_REGION,
        });

        new gotiac.MailUser('MailUser', {
            region: env.AWS_MAIL_REGION,
            domain: env.BASE_DOMAIN,
            displayName: 'Info',
            name: 'Info',
            emailPrefix: 'info',
        });

        return {
            // url: pulumi.interpolate`https://${fileHosting.url}`,
            // privateKeyId: fileHosting.privateKeyId,
            // privateKeyParameterName: fileHosting.privateKeyParameterName,
        };
    },
});

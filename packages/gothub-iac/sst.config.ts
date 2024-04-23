/// <reference path="./.sst/platform/config.d.ts" />
import * as pulumi from '@pulumi/pulumi';
import * as gotiac from '@pulumi/gotiac';

export default $config({
    app(input) {
        return {
            name: 'gothub-iac',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
            providers: {
                aws: {
                    region: process.env.AWS_REGION as $util.Input<aws.Region>,
                    profile: process.env.AWS_PROFILE,
                },
            },
        };
    },
    async run() {
        const fileHosting = new gotiac.FileHosting('FileHosting', {
            domain: process.env.FILE_HOSTING_DOMAIN,
            bucketName: process.env.FILE_HOSTING_BUCKET,
        });

        return {
            url: pulumi.interpolate`https://${fileHosting.url}`,
            privateKeyId: fileHosting.privateKeyId,
            privateKeyParameterName: fileHosting.privateKeyParameterName,
        };
    },
});

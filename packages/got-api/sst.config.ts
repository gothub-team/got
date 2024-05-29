/// <reference path="./.sst/platform/config.d.ts" />

import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as path from 'path';

const AWS_REGION = '';
const AWS_PROFILE = '';

export default $config({
    app(input) {
        return {
            name: 'got-api',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
            providers: {
                aws: {
                    // TODO: Add AWS env
                    region: AWS_REGION,
                    profile: AWS_PROFILE,
                },
            },
        };
    },
    async run() {
        const api = new gotiac.Api('TestApi', {
            userPoolId: 'eu-central-1_orSPNPiED',
            runtime: 'nodejs20.x',
            codePath: path.join(process.cwd(), 'dist/lambda/zips'),
            bucketNodesName: `${AWS_PROFILE}-nodes`,
            bucketEdgesName: `${AWS_PROFILE}-edges`,
            bucketReverseEdgesName: `${AWS_PROFILE}-reverse-edges`,
            bucketRightsReadName: `${AWS_PROFILE}-rights-read`,
            bucketRightsWriteName: `${AWS_PROFILE}-rights-write`,
            bucketRightsAdminName: `${AWS_PROFILE}-rights-admin`,
            bucketRightsOwnerName: `${AWS_PROFILE}-owners`,
        });
        return api;
    },
});

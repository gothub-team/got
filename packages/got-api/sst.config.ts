/// <reference path="./.sst/platform/config.d.ts" />

import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as path from 'path';
import { AWS_PROFILE, AWS_REGION, USER_POOL_ID, parseEnv } from '@gothub/typescript-util';

const env = parseEnv({
    AWS_PROFILE,
    AWS_REGION,
    USER_POOL_ID,
});

export default $config({
    app(input) {
        return {
            name: 'got-api',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
            providers: {
                aws: {
                    // TODO: Add AWS env
                    region: env.AWS_REGION,
                    profile: env.AWS_PROFILE,
                },
            },
        };
    },
    async run() {
        const api = new gotiac.Api('TestApi', {
            userPoolId: env.USER_POOL_ID,
            runtime: 'nodejs20.x',
            codePath: path.join(process.cwd(), 'dist/lambda/zips'),
            bucketNodesName: `${env.AWS_PROFILE}-nodes`,
            bucketEdgesName: `${env.AWS_PROFILE}-edges`,
            bucketReverseEdgesName: `${env.AWS_PROFILE}-reverse-edges`,
            bucketRightsReadName: `${env.AWS_PROFILE}-rights-read`,
            bucketRightsWriteName: `${env.AWS_PROFILE}-rights-write`,
            bucketRightsAdminName: `${env.AWS_PROFILE}-rights-admin`,
            bucketRightsOwnerName: `${env.AWS_PROFILE}-owners`,
        });
        return api;
    },
});

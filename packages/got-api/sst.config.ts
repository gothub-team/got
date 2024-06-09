/// <reference path="./.sst/platform/config.d.ts" />

import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as path from 'path';
import { AWS_PROFILE, AWS_REGION, GOT_API_DOMAIN, USER_POOL_ID, parseEnv } from '@gothub/typescript-util';

const env = parseEnv({
    AWS_PROFILE,
    AWS_REGION,
    USER_POOL_ID,
    GOT_API_DOMAIN,
});

export default $config({
    app(input) {
        return {
            name: 'got-api',
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
        const userPool = new gotiac.UserPool('TestUserPool');

        const api = new gotiac.Api('TestApi', {
            domainName: env.GOT_API_DOMAIN,
            userPoolId: userPool.userPoolId,
            runtime: 'nodejs20.x',
            codePath: path.join(process.cwd(), 'dist/lambda/zips'),
        });
        return api;
    },
});

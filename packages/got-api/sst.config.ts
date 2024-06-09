/// <reference path="./.sst/platform/config.d.ts" />

import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as path from 'path';
import * as fs from 'fs';
import { AWS_PROFILE, AWS_REGION, GOT_API_DOMAIN, USER_POOL_ID, parseEnv } from '@gothub/typescript-util';
import { TEST_ADMIN_EMAIL, TEST_USER_1_EMAIL, TEST_USER_2_EMAIL } from '@gothub/got-api-test/env';

const env = parseEnv({
    AWS_PROFILE,
    AWS_REGION,
    USER_POOL_ID,
    GOT_API_DOMAIN,
    TEST_ADMIN_EMAIL,
    TEST_USER_1_EMAIL,
    TEST_USER_2_EMAIL,
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

        testResources({ userPool });

        return api;
    },
});

const testResources = ({ userPool }: { userPool: gotiac.UserPool }) => {
    const testAdmin = new gotiac.TestUser('TestAdmin', {
        userPoolId: userPool.userPoolId,
        email: env.TEST_ADMIN_EMAIL,
    });
    const testUser1 = new gotiac.TestUser('TestUser1', {
        userPoolId: userPool.userPoolId,
        email: env.TEST_USER_1_EMAIL,
    });
    const testUser2 = new gotiac.TestUser('TestUser2', {
        userPoolId: userPool.userPoolId,
        email: env.TEST_USER_2_EMAIL,
    });
    fs.writeFileSync('.test-users.env', '# Automatically generated test users. Do not edit this file.\n');
    testAdmin.password.apply((password) => {
        fs.appendFileSync('.test-users.env', `export TEST_ADMIN_PW='${password}'\n`);
    });
    testUser1.password.apply((password) => {
        fs.appendFileSync('.test-users.env', `export TEST_USER_1_PW='${password}'\n`);
    });
    testUser2.password.apply((password) => {
        fs.appendFileSync('.test-users.env', `export TEST_USER_2_PW='${password}'\n`);
    });
};

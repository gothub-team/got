/// <reference path="./.sst/platform/config.d.ts" />
import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as fs from 'fs';

import { env } from './env';

export default $config({
    app(input) {
        return {
            name: 'got-api-test',
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
        const testUser1 = new gotiac.TestUser('TestUser1', {
            userPoolId: env.USER_POOL_ID,
            email: env.TEST_USER_1_EMAIL,
        });
        const testUser2 = new gotiac.TestUser('TestUser2', {
            userPoolId: env.USER_POOL_ID,
            email: env.TEST_USER_2_EMAIL,
        });
        fs.writeFileSync('.test-users.env', '');
        testUser1.password.apply((password) => {
            fs.appendFileSync('.test-users.env', `export TEST_USER_1_PW='${password}'\n`);
        });
        testUser2.password.apply((password) => {
            fs.appendFileSync('.test-users.env', `export TEST_USER_2_PW='${password}'\n`);
        });
    },
});

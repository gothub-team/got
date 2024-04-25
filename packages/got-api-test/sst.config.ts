/// <reference path="./.sst/platform/config.d.ts" />
import * as gotiac from '@pulumi/gotiac';
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
        const user = new gotiac.TestAdminUser('TestAdminUser', {
            userPoolId: env.USER_POOL_ID,
            email: env.TEST_ADMIN_USER_EMAIL,
        });

        user.password.apply((password) => {
            fs.writeFileSync('.test-admin-pw.env', `export TEST_ADMIN_PW='${password}'`);
        });
    },
});

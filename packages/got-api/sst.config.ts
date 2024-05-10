/// <reference path="./.sst/platform/config.d.ts" />

import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as path from 'path';

export default $config({
    app(input) {
        return {
            name: 'got-api',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
            providers: {
                aws: {
                    // TODO: Add AWS env
                    region: '',
                    profile: '',
                },
            },
        };
    },
    async run() {
        const lambda = new gotiac.Lambda('TestLambda', {
            runtime: 'nodejs18.x',
            codePath: path.join(process.cwd(), 'index.zip'),
            handlerPath: 'index.handler',
            policyArns: [],
        });
    },
});

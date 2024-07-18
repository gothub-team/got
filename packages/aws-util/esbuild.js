import build from '@gothub/typescript-util/esbuild.js';

build({
    minBundle: true,
    min: {
        external: ['aws-sdk*', '@aws-sdk*'],
    },
});

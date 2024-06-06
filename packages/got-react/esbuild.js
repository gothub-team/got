import build from '@gothub/typescript-util/esbuild.js';

build({
    min: {
        external: ['react'],
    },
});

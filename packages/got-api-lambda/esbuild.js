import build from '@gothub/typescript-util/esbuild.lambda.js';

build({ srcDir: './src/handler', outDir: './dist/lambda' });

import build from '@gothub/typescript-util/esbuild.lambda.js';

build({ srcDir: './src/handler/auth', outDir: './dist/lambda/auth' });

build({ srcDir: './src/handler/pull.ts', outDir: './dist/lambda' });
build({ srcDir: './src/handler/push.ts', outDir: './dist/lambda' });

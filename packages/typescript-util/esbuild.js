const path = require('path');
const fs = require('fs');
const { build } = require('esbuild');
const { dtsPlugin } = require('esbuild-plugin-d.ts');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
    const entries = fs.readdirSync(dirPath);

    const dirs = entries.filter((file) => fs.statSync(`${dirPath}/${file}`).isDirectory());
    const files = entries.filter((file) => !fs.statSync(`${dirPath}/${file}`).isDirectory());

    dirs.forEach((dir) => {
        arrayOfFiles = getAllFiles(`${dirPath}/${dir}`, arrayOfFiles);
    });

    files.forEach((file) => {
        if (file.endsWith('.js') && !file.endsWith('.spec.js')) {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts') && !file.endsWith('.d.ts')) {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
}

const clean = () => {
    fs.existsSync('./dist') && fs.rmSync('./dist', { recursive: true, force: true });
};

const buildTs = async (options = {}) => {
    clean();
    const srcDir = options.srcDir || './src';
    const entryFiles = getAllFiles(srcDir);

    // compile CJS
    console.log('Compiling CJS...');
    await build({
        logLevel: 'info',
        bundle: false,
        target: 'node18.0',
        platform: 'node',
        format: 'cjs',
        entryPoints: entryFiles,
        outdir: './dist/cjs',
    });

    if (options.minBundle) {
        // compile minified CJS
        console.log('Compiling minified CJS...');
        await build({
            logLevel: 'info',
            minify: true,
            treeShaking: true,
            target: 'node18.0',
            platform: 'node',
            format: 'cjs',
            entryPoints: entryFiles,
            outdir: './dist/min',
        });

        // compile minified bundle CJS
        console.log('Compiling minified bundled CJS...');
        await build({
            logLevel: 'info',
            bundle: true,
            minify: true,
            treeShaking: true,
            sourcemap: true,
            target: 'node18.0',
            platform: 'node',
            format: 'cjs',
            external: options?.min?.external || [],
            entryPoints: [`${srcDir}/index.ts`],
            outfile: './dist/min-bundle/index.js',
        });
    }

    // compile ESM with types
    console.log('Compiling ESM...');
    await build({
        logLevel: 'info',
        bundle: false,
        target: 'node18.0',
        platform: 'node',
        format: 'esm',
        entryPoints: entryFiles,
        outdir: './dist/module',
        plugins: [
            dtsPlugin({
                outDir: './dist/types', // do types only once
            }),
        ],
    });
};

module.exports = buildTs;

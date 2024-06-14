const path = require('path');
const fs = require('fs');
const { build } = require('esbuild');
const { builtinModules } = require('module');

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

const clean = (targetDir) => {
    fs.existsSync(targetDir) && fs.rmSync(targetDir, { recursive: true, force: true });
};

const buildTs = async () => {
    const srcDir = './lambda/auth';
    const targetDir = './dist/lambda/auth';

    clean(targetDir);

    const entryFiles = getAllFiles(srcDir);
    // compiled code
    await build({
        logLevel: 'info',
        bundle: true,
        minify: true,
        treeShaking: true,
        external: ['aws-sdk*', '@aws-sdk*', ...builtinModules],
        target: 'node20.0',
        platform: 'node',
        format: 'cjs',
        entryPoints: entryFiles,
        outdir: targetDir,
    });
};

module.exports = buildTs;

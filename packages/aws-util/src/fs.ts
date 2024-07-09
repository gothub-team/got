import { promises } from 'fs';
const { exists, readFile, readdir, mkdir, writeFile, rm } = promises;

export const fsexist = exists;

export const fsget = async (path: string) => {
    if (await exists(path)) {
        return readFile(path, 'utf8');
    }

    return null;
};

export const fsput = async (path: string, data: string) => {
    const dir = path.split('/').slice(0, -1).join('/');
    if (!(await exists(dir))) {
        await mkdir(dir, { recursive: true });
    }
    return writeFile(path, data, 'utf8');
};

export const fsdelete = async (path: string) => {
    if (await exists(path)) {
        return rm(path);
    }
};

const fslistRecursive = async (path: string) => {
    const items = await readdir(path, { recursive: true, withFileTypes: true });

    const files = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.isFile()) {
            files.push(item.name);
        }
    }

    return files;
};

export const fslist = async (path: string) => {
    const basePath = path.split('/').slice(0, -1).join('/');
    const wildcard = path.split('/').pop();

    if (!wildcard) {
        return fslistRecursive(basePath);
    }

    const items = await readdir(basePath, { withFileTypes: true });

    const files = [];
    const promises = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.name.startsWith(path)) {
            if (item.isFile()) {
                files.push(item.name);
            } else if (item.isDirectory()) {
                promises.push(fslistRecursive(`${basePath}/${item.name}`));
            }
        }
    }

    const nestedFiles = await Promise.all(promises);
    for (let i = 0; i < nestedFiles.length; i++) {
        files.push(...nestedFiles[i]);
    }

    return files;
};

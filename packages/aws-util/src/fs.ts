import fs from 'fs';
import { promisify } from 'util';

const exists = promisify(fs.exists); // exists is deprecated, look for replacement/error handling in the future
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const rm = promisify(fs.rm);

export const fsexist = exists;

export const fsget = async (path: string) => {
    try {
        return readFile(path, 'utf8');
    } catch {
        return null;
    }
};

export const fsput = async (path: string, data: string) => {
    const dir = path.split('/').slice(0, -1).join('/');
    try {
        return writeFile(path, data, 'utf8');
    } catch {
        await mkdir(dir, { recursive: true });
        return writeFile(path, data, 'utf8');
    }
};

export const fsdelete = async (path: string) => {
    try {
        return rm(path);
    } catch {
        return null;
    }
};

const fslistRecursive = async (path: string) => {
    try {
        const items = await readdir(path, { recursive: true, withFileTypes: true });

        const files = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.isFile()) {
                files.push(item.name);
            }
        }

        return files;
    } catch {
        return [];
    }
};

export const fslist = async (path: string) => {
    const basePath = path.split('/').slice(0, -1).join('/');
    const wildcard = path.split('/').pop();

    if (!wildcard) {
        return fslistRecursive(basePath);
    }

    try {
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
    } catch {
        return [];
    }
};

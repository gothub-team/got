import fs from 'fs';
import { promisify } from 'util';

const access = promisify(fs.access);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const rm = promisify(fs.rm);

export const fsexist = async (path: string) => {
    try {
        await access(path, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

export const fsget = async (path: string) => {
    try {
        const res = await readFile(path, 'utf8');
        return res;
    } catch {
        return null;
    }
};

export const fsput = async (path: string, data: string) => {
    const dir = path.split('/').slice(0, -1).join('/');
    try {
        await writeFile(path, data, 'utf8');
    } catch {
        await mkdir(dir, { recursive: true });
        await writeFile(path, data, 'utf8');
    }
};

export const fsdelete = async (path: string) => {
    try {
        await rm(path);
    } catch {
        // Does not exist
    }
};

const fslistRecursive = async (location: string, path: string) => {
    try {
        const items = await readdir(path, { recursive: true, withFileTypes: true });

        const files = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.isFile()) {
                files.push(item.name.replace(`${location}/`, ''));
            }
        }

        return files;
    } catch {
        return [];
    }
};

export const fslist = async (location: string, path: string) => {
    const basePath = path.split('/').slice(0, -1).join('/');
    const wildcard = path.split('/').pop();

    if (!wildcard) {
        return fslistRecursive(location, basePath);
    }

    try {
        const items = await readdir(basePath, { withFileTypes: true });

        const files = [];
        const promises = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.name.startsWith(path)) {
                if (item.isFile()) {
                    files.push(item.name.replace(`${location}/`, ''));
                } else if (item.isDirectory()) {
                    promises.push(fslistRecursive(location, `${basePath}/${item.name}`));
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

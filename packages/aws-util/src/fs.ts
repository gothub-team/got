import fs from 'fs';
import { promisify } from 'util';
import type { Storage } from './storage.type';
import * as Path from 'path';

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
        return res ?? null; // Return null if the file is empty
    } catch {
        return undefined;
    }
};

export const fsput = async (path: string, data: string) => {
    const dir = path.split('/').slice(0, -1).join('/');
    await mkdir(dir, { recursive: true });
    await writeFile(path, data, 'utf8');
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
        const items = await readdir(`${location}/${path}`, { recursive: true, withFileTypes: true });

        const files = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.isFile()) {
                files.push(`${item.parentPath.replace(`${location}/`, '')}/${item.name}`);
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
        const items = await readdir(basePath ? `${location}/${basePath}` : location, { withFileTypes: true });

        const files = [];
        const promises = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.name.startsWith(wildcard)) {
                if (item.isFile()) {
                    const dir = item.parentPath.replace(`${location}`, '');
                    files.push(dir ? `${dir}/${item.name}` : item.name);
                } else if (item.isDirectory()) {
                    promises.push(fslistRecursive(location, `${item.parentPath}/${item.name}`));
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

export class FSStorage implements Storage {
    async exist(location: string, path: string) {
        return fsexist(Path.join(location, path));
    }

    async get(location: string, path: string) {
        return fsget(Path.join(location, path));
    }

    async put(location: string, path: string, data: string) {
        return fsput(Path.join(location, path), data);
    }

    async delete(location: string, path: string) {
        return fsdelete(Path.join(location, path));
    }

    async list(location: string, path: string) {
        return fslist(location, path);
    }
}

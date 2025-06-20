import type { FileHead, Storage } from './storage.type';
import Path from 'path';

export class MemoryStorage implements Storage {
    storage: Map<string, string> = new Map();

    async exist(location: string, path: string) {
        return this.storage.has(Path.join(location, path));
    }

    async get(location: string, path: string) {
        const fullPath = Path.join(location, path);
        if (!this.storage.has(fullPath)) {
            return undefined;
        }

        return this.storage.get(fullPath) ?? null;
    }

    async head(location: string, path: string): Promise<FileHead | undefined> {
        throw new Error('MemoryStorage does not support head operation');
    }

    async delete(location: string, path: string) {
        const fullPath = Path.join(location, path);
        if (!this.storage.has(fullPath)) {
            return;
        }

        this.storage.delete(fullPath);
    }

    async put(location: string, path: string, data: string) {
        this.storage.set(Path.join(location, path), data);
    }

    async list(location: string, path: string) {
        const fullPath = Path.join(location, path);

        const matches: string[] = [];
        for (const key of this.storage.keys()) {
            if (key.startsWith(fullPath)) {
                matches.push(key.replace(`${location}/`, ''));
            }
        }

        return matches;
    }
}

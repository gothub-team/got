export type FileHead = {
    etag: string;
    contentType: string;
    modifiedDate: string;
    metadata: unknown;
    size: number;
};

export interface Storage {
    exist: (location: string, path: string) => Promise<boolean>;
    /**
     * `undefined` when the data does not exist.
     * `null` when the data is empty.
     * `string` when the data exists.
     */
    get: (location: string, path: string) => Promise<string | null | undefined>;
    head: (location: string, path: string) => Promise<FileHead | undefined>;
    put: (location: string, path: string, data: string) => Promise<void>;
    delete: (location: string, path: string) => Promise<void>;
    list: (location: string, path: string) => Promise<string[]>;
}

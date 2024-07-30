export type Signer = {
    getUrl: (fileKey: string, etag: string) => string;
    signUrl: (url: string, expires?: number) => string;
};

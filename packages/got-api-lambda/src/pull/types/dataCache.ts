export type DataCacheNodes = {
    setNode: (id: string, value: string) => void;
    getNode: (id: string) => string | undefined;
    setNodePromise: (id: string, value: Promise<string>) => void;
    getNodePromise: (id: string) => Promise<string> | undefined;
    removeNode: (id: string) => void;
    removeNodePromise: (id: string) => void;
};

export type DataCacheMetadata = {
    setMetadata: (fromId: string, edgeTypes: string, toId: string, metadata: string) => void;
    getMetadata: (fromId: string, edgeTypes: string, toId: string) => string | undefined;
    removeMetadata: (fromId: string, edgeTypes: string, toId: string) => void;
    setMetadataPromise: (fromId: string, edgeTypes: string, toId: string, metadata: Promise<string>) => void;
    getMetadataPromise: (fromId: string, edgeTypes: string, toId: string) => Promise<string> | undefined;
    removeMetadataPromise: (fromId: string, edgeTypes: string, toId: string) => void;
};

export type UrlObject = {
    url: string;
    expire: number;
};

export type DataCacheUrls = {
    setUrl: (fileKey: string, etag: string, value: UrlObject) => void;
    getUrl: (fileKey: string, etag: string) => UrlObject | undefined;
    removeUrl: (fileKey: string, etag: string) => void;
};

export type DataCache = {
    nodes: DataCacheNodes;
    metadata: DataCacheMetadata;
    urls: DataCacheUrls;
};

export declare type OK = {
    statusCode: 200;
};
export declare type FORBIDDEN = {
    statusCode: 403;
    name: 'NoWriteRightError' | 'NoAdminRightError';
};
export declare type OK_UPLOAD = {
    statusCode: 200;
    uploadUrls: Array<string>;
    uploadId?: string;
};
export declare type GraphElementResult = OK | FORBIDDEN;
export declare type UploadElementResult = OK_UPLOAD | FORBIDDEN;

export declare interface GraphError<TElement> extends FORBIDDEN {
    element: TElement;
}

export declare type Node<T extends Record<string, unknown> = Record<string, unknown>> = {
    id: string;
} & T;

export declare type Metadata<T extends Record<string, unknown> = Record<string, unknown>> = T | boolean;

export declare type RightTypes = {
    /**
     * `true` will grant the read right, `false` will revoke the read right whereas
     * `undefined` will perform no action for the read right.
     */
    read?: boolean;
    /**
     * `true` will grant the write right, `false` will revoke the write right whereas
     * `undefined` will perform no action for the write right.
     */
    write?: boolean;
    /**
     * `true` will grant the read admin, `false` will revoke the read admin whereas
     * `undefined` will perform no action for the read admin.
     */
    admin?: boolean;
};

export declare type NodeRightsView = {
    user?: {
        [email: string]: RightTypes;
    };
    role?: {
        [email: string]: RightTypes;
    };
};

export declare type NodeFileView = DownloadNodeFileView | UploadNodeFileView;

export declare type DownloadNodeFileView = {
    url: string;
    etag: string;
    contentType: string;
    modifiedDate: string;
};

export declare type UploadNodeFileView = {
    filename: string;
    contentType: string;
    fileSize: number;
    partSize?: number;
};

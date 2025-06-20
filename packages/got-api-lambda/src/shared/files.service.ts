import { loadQueue, type Storage } from '@gothub/aws-util';

export type FileRef = {
    prop: string;
    fileKey: string;
};

export type FileMetadata = {
    nodeId: string;
    prop: string;
    filename: string;
    contentType: string;
    fileSize: number;
};

export class FileService {
    taskQueue = loadQueue(50);

    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            MEDIA: string;
        },
    ) {}

    getFileHead(fileKey: string) {
        return this.taskQueue.queueLoad(() => this.storage.head(this.locations.MEDIA, fileKey));
    }

    async setFileRef(nodeId: string, prop: string, fileRef: { fileKey: string } | null) {
        const refId = `ref/${nodeId}/${prop}`;
        if (fileRef === null) {
            return this.storage.delete(this.locations.MEDIA, refId);
        } else {
            return this.storage.put(this.locations.MEDIA, refId, JSON.stringify({ fileKey: fileRef.fileKey }));
        }
    }

    async getFileRef(nodeId: string, prop: string) {
        const refId = `ref/${nodeId}/${prop}`;
        const res = await this.storage.get(this.locations.MEDIA, refId);
        if (!res) return null;

        const fileRef = JSON.parse(res) as { fileKey: string };

        if (!fileRef?.fileKey) {
            return null;
        }

        return { ...fileRef, prop };
    }

    async getFileRefs(nodeId: string) {
        return this.taskQueue.queueLoad(async () => {
            const keys = await this.storage.list(this.locations.MEDIA, `ref/${nodeId}`);

            const promises = new Array(keys.length);
            for (let i = 0; i < keys.length; i++) {
                const [, , prop] = keys[i].split('/');
                promises[i] = this.getFileRef(nodeId, prop);
            }

            const refs = await Promise.all(promises);
            return refs.filter(Boolean) as FileRef[];
        });
    }

    async setFileMetadata(fileKey: string, metadata: FileMetadata | null) {
        if (metadata === null) {
            return this.storage.delete(this.locations.MEDIA, `metadata/${fileKey}`);
        } else {
            return this.storage.put(
                this.locations.MEDIA,
                `metadata/${fileKey}`,
                JSON.stringify({
                    nodeId: metadata.nodeId,
                    prop: metadata.prop,
                    filename: metadata.filename,
                    contentType: metadata.contentType,
                    fileSize: metadata.fileSize,
                }),
            );
        }
    }

    async getFileMetadata(fileKey: string): Promise<FileMetadata | null> {
        const metadataKey = `metadata/${fileKey}`;
        const res = await this.storage.get(this.locations.MEDIA, metadataKey);
        if (!res) return null;

        return JSON.parse(res) as FileMetadata;
    }

    async setUploadId(uploadId: string, fileKey: string | null) {
        if (fileKey === null) {
            return this.storage.delete(this.locations.MEDIA, `uploads/${uploadId}`);
        } else {
            return this.storage.put(this.locations.MEDIA, `uploads/${uploadId}`, JSON.stringify({ fileKey }));
        }
    }

    async getUpload(uploadId: string) {
        const res = await this.storage.get(this.locations.MEDIA, `uploads/${uploadId}`);
        if (!res) return null;

        const { fileKey = '' } = JSON.parse(res.toString()) as { fileKey: string };
        return fileKey;
    }
}

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
    UploadPartCommand,
} from '@aws-sdk/client-s3';
import { AWS_REGION, CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER, MEDIA_DOMAIN } from './config.js';
import { signUrl } from './cloudfront.js';

const client = new S3Client({
    region: AWS_REGION,
    apiVersion: 'latest',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const streamToBuffer = (stream: any): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });

export const s3put = async (bucket: string, key: string, data: unknown) => {
    const Body = data ? Buffer.from(JSON.stringify(data)) : undefined;
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body,
    });
    try {
        await client.send(command);
        return undefined;
    } catch (err) {
        console.error(err);
        return undefined;
    }
};
export const s3putRaw = async (bucket: string, key: string, data: Buffer, { contentType }: { contentType: string }) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
    });
    try {
        await client.send(command);
        return undefined;
    } catch (err) {
        console.error(err);
        return undefined;
    }
};
export const s3putSignedUrl = async (bucket: string, key: string, { contentType }: { contentType: string }) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
        CacheControl: 'max-age=31557600',
    });
    try {
        return getSignedUrl(client, command, { expiresIn: 3600 });
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

export const s3createMultipartUpload = async (
    bucket: string,
    key: string,
    { contentType }: { contentType: string },
) => {
    const command = new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
        CacheControl: 'max-age=31557600',
    });
    try {
        const results = await client.send(command);
        return results.UploadId;
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

export const s3uploadPartSignedUrl = async (
    bucket: string,
    key: string,
    { uploadId, partNumber }: { uploadId: string; partNumber: number },
) => {
    const command = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
    });
    try {
        return getSignedUrl(client, command, { expiresIn: 3600 });
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

export const s3putMultipartSignedUrls = async (
    bucket: string,
    key: string,
    { contentType, fileSize, partSize }: { contentType: string; fileSize: number; partSize: number },
) => {
    const uploadId = await s3createMultipartUpload(bucket, key, { contentType });

    if (!uploadId) {
        console.error('Could not create multipart upload.');
        return undefined;
    }

    try {
        const promises = [];
        for (let i = 0; i < Math.ceil(fileSize / partSize); i++) {
            if (CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER) {
                promises.push(signUrl(`https://${MEDIA_DOMAIN}/${key}?partNumber=${i + 1}&uploadId=${uploadId || ''}`));
            } else {
                promises.push(s3uploadPartSignedUrl(bucket, key, { uploadId, partNumber: i + 1 }));
            }
        }

        const uploadUrls = await Promise.all(promises);

        return { uploadId, uploadUrls };
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

export const s3completeMultipartUpload = async (
    bucket: string,
    key: string,
    { uploadId, partEtags }: { uploadId: string; partEtags: string[] },
) => {
    const command = new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        MultipartUpload: {
            Parts: partEtags.map((etag, i) => ({
                ETag: etag,
                PartNumber: i + 1,
            })),
        },
        UploadId: uploadId,
    });
    try {
        await client.send(command);
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const s3get = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        const results = await client.send(command);
        return results.Body ? streamToBuffer(results.Body) : null;
    } catch (err) {
        return undefined;
    }
};
export const s3delete = async (bucket: string, key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        await client.send(command);
        return undefined;
    } catch (err) {
        return undefined;
    }
};
export const s3exists = async (bucket: string, key: string) => {
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        await client.send(command);
        return true;
    } catch (err) {
        return false;
    }
};
export const s3head = async (bucket: string, key: string) => {
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        const results = await client.send(command);
        return {
            etag: results.ETag || '',
            contentType: results.ContentType || '',
            modifiedDate: results.LastModified?.toISOString() || '',
            metadata: results.Metadata,
            size: results.ContentLength || 0,
        };
    } catch (err) {
        return false;
    }
};
export const s3metadata = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        const results = await client.send(command);
        const buffer = await streamToBuffer(results.Body);
        if (buffer.length > 0) {
            return JSON.parse(buffer.toString());
        }

        if (typeof results.Metadata === 'object' && Object.keys(results.Metadata).length >= 0) {
            return results.Metadata;
        }

        return true;
    } catch (err) {
        return false;
    }
};
export const s3existsPrefix = async (bucket: string, prefix: string) => {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: 1,
    });
    try {
        const results = await client.send(command);
        return (results.Contents || []).length > 0;
    } catch (err) {
        return false;
    }
};
export const s3list = async (bucket: string, prefix: string) => {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
    });
    try {
        const results = await client.send(command);
        return results.Contents || [];
    } catch (err) {
        return [];
    }
};

type Observable<TNext> = {
    next: (value: TNext) => void | Promise<void>;
    complete: () => void | Promise<void>;
    error: (err: Error) => void | Promise<void>;
};

export const s3listPaged = (bucket: string, prefix: string) => ({
    subscribe: (subscriber: Observable<{ Key?: string; ETag?: string }[]>) => {
        try {
            const _FETCH_PAGE = async (continuationToken?: string) => {
                const command = new ListObjectsV2Command({
                    Bucket: bucket,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                });
                // handling contents in then function so they are local and can get GCed after handling
                const ContinuationToken = await client.send(command).then(({ Contents, NextContinuationToken }) => {
                    subscriber.next(Contents || []);
                    return NextContinuationToken;
                });

                ContinuationToken ? _FETCH_PAGE(ContinuationToken) : subscriber.complete();
            };
            _FETCH_PAGE();
        } catch (err) {
            subscriber.error(err as Error);
        }
    },
});

export const s3mapListKeysPaged = async (
    bucket: string,
    prefix: string,
    fnMap: (key: string, ETag: string) => void | Promise<void>,
) =>
    new Promise((resolve, reject) => {
        s3listPaged(bucket, prefix).subscribe({
            next: (arr) =>
                arr.forEach(({ Key, ETag }) => {
                    Key && ETag && fnMap(Key, ETag);
                }),
            complete: () => resolve(true),
            error: (err) => reject(err),
        });
    });

export const s3listKeysPaged = async (bucket: string, prefix: string) => {
    const records: string[] = [];
    await s3mapListKeysPaged(bucket, prefix, (key) => {
        records.push(key);
    });
    return records;
};

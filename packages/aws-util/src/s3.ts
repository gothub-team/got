import * as RA from 'ramda-adjunct';
import * as R from 'ramda';
import { Observable } from 'rxjs';
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
import { promiseAll } from './util.js';
import { signUrl } from './cloudfront.js';

const client = new S3Client({
    region: AWS_REGION,
    signatureVersion: 'v4',
    apiVersion: 'latest',
});

const streamToBuffer = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });

export const s3put = async (bucket, key, data) => {
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
export const s3putRaw = async (bucket, key, data, { contentType }) => {
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
export const s3putSignedUrl = async (bucket, key, { contentType }) => {
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

export const s3createMultipartUpload = async (bucket, key, { contentType }) => {
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

export const s3uploadPartSignedUrl = async (bucket, key, { contentType, uploadId, partNumber }) => {
    const command = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
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

export const s3putMultipartSignedUrls = async (bucket, key, { contentType, fileSize, partSize }) => {
    const uploadId = await s3createMultipartUpload(bucket, key, { contentType });

    try {
        const uploadUrls = await R.compose(
            promiseAll,
            R.map((partNumber) =>
                CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER
                    ? signUrl(`https://${MEDIA_DOMAIN}/${key}?partNumber=${partNumber}&uploadId=${uploadId || ''}`)
                    : s3uploadPartSignedUrl(bucket, key, { contentType, uploadId, partNumber }),
            ),
            R.range(1),
            R.add(1),
            Math.ceil,
        )(fileSize / partSize);
        return { uploadId, uploadUrls };
    } catch (err) {
        console.error(err);
        return undefined;
    }
};

export const s3completeMultipartUpload = async (bucket, key, { uploadId, partEtags }) => {
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

export const s3get = async (bucket, key) => {
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
export const s3delete = async (bucket, key) => {
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
export const s3exists = async (bucket, key) => {
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
export const s3head = async (bucket, key) => {
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        const results = await client.send(command);
        return {
            etag: results.ETag || '',
            contentType: results.ContentType || '',
            modifiedDate: results.LastModified.toISOString() || '',
            metadata: results.Metadata,
            size: results.ContentLength || 0,
        };
    } catch (err) {
        return false;
    }
};
export const s3metadata = async (bucket, key) => {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    try {
        const results = await client.send(command);
        const buffer = await streamToBuffer(results.Body);
        if (buffer.length > 0) {
            return JSON.parse(buffer);
        }
        return RA.isNotNilOrEmpty(results.Metadata) ? results.Metadata : true;
    } catch (err) {
        return false;
    }
};
export const s3existsPrefix = async (bucket, prefix) => {
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
export const s3list = async (bucket, prefix) => {
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
export const s3listPaged = (bucket, prefix) =>
    new Observable((subscriber) => {
        try {
            const _FETCH_PAGE = async (continuationToken) => {
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
            subscriber.error(err);
        }
    });

export const s3mapListKeysPaged = async (bucket, prefix, fnMap) =>
    new Promise((resolve, reject) => {
        s3listPaged(bucket, prefix).subscribe({
            next: R.forEach(({ Key, ETag }) => fnMap && fnMap(Key, ETag)),
            complete: () => resolve(),
            error: (err) => reject(err),
        });
    });

export const s3listKeysPaged = async (bucket, prefix) => {
    const records = [];
    await s3mapListKeysPaged(bucket, prefix, (key) => records.push(key));
    return records;
};

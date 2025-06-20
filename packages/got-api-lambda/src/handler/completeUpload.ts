import { CORS_HEADERS, internalServerError } from '@gothub/aws-util';
import { s3completeMultipartUpload, S3Storage } from '@gothub/aws-util/s3';
import type { APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';
// TODO: we are currently importing utils from push
import { BUCKET_MEDIA } from '../push/config';
import { validateAuthed, type AuthedValidationResult } from '@gothub/aws-util/validation';
import { FileService } from '../shared/files.service';

export const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        uploadId: {
            type: 'string',
            description: '',
        },
        partEtags: {
            type: 'array',
            description: '',
            items: {
                type: 'string',
            },
        },
    },
    required: ['uploadId', 'partEtags'],
};

export type Body = {
    uploadId: string;
    partEtags: string[];
};

const handle = async ({ body }: AuthedValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const { uploadId, partEtags } = body;

    const storage = new S3Storage();
    const fileService = new FileService(storage, {
        MEDIA: BUCKET_MEDIA,
    });

    const fileKey = await fileService.getUpload(uploadId);
    if (!fileKey) {
        return {
            statusCode: 400,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: 'Invalid Upload ID' }),
        };
    }

    // TODO: move to storage and file service
    await s3completeMultipartUpload(BUCKET_MEDIA, fileKey, { uploadId, partEtags });
    await fileService.setUploadId(uploadId, null);

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({}),
    };
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const validationResult = await validateAuthed<Body>(schema, event);
        const result = await handle(validationResult);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

export const handleInvoke: Handler = async ({ body }) => {
    try {
        const result = await handle(body as AuthedValidationResult<Body>);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

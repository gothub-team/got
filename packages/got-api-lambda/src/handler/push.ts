import { CORS_HEADERS, internalServerError } from '@gothub/aws-util';
import type { Graph } from '@gothub/got-core';
import type { APIGatewayProxyHandler, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { push } from '../push';
import { cfSigner } from '../push/util/signer';
import { graphAssembler } from '../push/util/graphAssembler';
import { createDataCache } from '../push/caches/dataCache';
import { validateAuthed, type AuthedValidationResult } from '@gothub/aws-util/validation';
import { S3Storage } from '@gothub/aws-util/s3';
import {
    BUCKET_EDGES,
    BUCKET_LOGS,
    BUCKET_MEDIA,
    BUCKET_NODES,
    BUCKET_OWNERS,
    BUCKET_REVERSE_EDGES,
    BUCKET_RIGHTS_ADMIN,
    BUCKET_RIGHTS_READ,
    BUCKET_RIGHTS_WRITE,
} from '../push/config';
import { PushLogsService } from '../shared/push-logs.service';
import { FileService } from '../shared/files.service';
import { GraphService } from '../shared/graph.service';
import { RightsService } from '../shared/rights.service';

export const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        nodes: {
            type: 'object',
            description: 'The nodes hashmap.',
            example: {
                'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                    id: 'e1d05e83-4122-4fd9-9502-d12e7867b4d6',
                    someProp: 'someVal',
                },
            },
            additionalProperties: {
                oneOf: [
                    { type: 'boolean', const: false, description: '`false` when the node should be deleted.' },
                    {
                        type: 'object',
                        additionalProperties: true,
                        properties: {
                            id: {
                                type: 'string',
                                description: 'The id of the node which should be updated.',
                                example: 'e1d05e83-4122-4fd9-9502-d12e7867b4d6',
                                minLength: 1,
                            },
                        },
                        required: ['id'],
                    },
                ],
            },
        },
        edges: {
            type: 'object',
            description: '`fromType`s: A `fromType` hashmap representing all `fromType`s of all present edges.',
            example: {
                'todo-app': {
                    'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                        'todo-list': {
                            '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' },
                        },
                    },
                },
            },
            additionalProperties: {
                type: 'object',
                description:
                    '`fromId`s: A `from` hashmap representing all `fromId`s of all edges pointing from the given `fromType`.',
                example: {
                    'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                        'todo-list': {
                            '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' },
                        },
                    },
                },
                additionalProperties: {
                    type: 'object',
                    description:
                        '`toType`s: A `toType` hashmap representing all `toType`s of all edges pointing from the given `fromType` and `fromId`.',
                    example: {
                        'todo-list': {
                            '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' },
                        },
                    },
                    additionalProperties: {
                        type: 'object',
                        description:
                            '`toId`s: A `toId` hashmap representing all `toId`s of all edges pointing from the given `fromType`, `fromId`, `toType` and `toId`.',
                        example: {
                            '6da76147-c72a-4819-8efe-f4f8e06b6be6': { order: '1' },
                        },
                        additionalProperties: {
                            oneOf: [
                                {
                                    type: 'boolean',
                                    description:
                                        '`true` when the edge should be created. `false` when the edge should be deleted.',
                                },
                                {
                                    type: 'object',
                                    description:
                                        'Is interpreted as `true` meaning the edge should be created. Object contains additional metadata to be set for the given edge.',
                                    additionalProperties: {
                                        oneOf: [
                                            { type: 'string' },
                                            { type: 'number' },
                                            { type: 'boolean' },
                                            { type: 'null' },
                                            {
                                                type: 'array',
                                                items: {
                                                    oneOf: [
                                                        { type: 'string' },
                                                        { type: 'number' },
                                                        { type: 'boolean' },
                                                        { type: 'null' },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        rights: {
            type: 'object',
            description: '`id`s: A node `id` hashmap representing all nodes which rights should be updated for.',
            example: {
                'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                    user: {
                        'test@mail.de': {
                            read: true,
                            write: true,
                            admin: true,
                        },
                    },
                    inherit: {
                        from: '6da76147-c72a-4819-8efe-f4f8e06b6be6',
                    },
                },
            },
            additionalProperties: {
                type: 'object',
                description:
                    'emails: An email hashmap representing all users which rights should be updated for on the given node.',
                properties: {
                    user: {
                        type: 'object',
                        description: '',
                        example: {
                            'test@mail.de': {
                                read: true,
                                write: true,
                                admin: true,
                            },
                        },
                        additionalProperties: {
                            type: 'object',
                            description:
                                'rights: A right hashmap representing all rights which should be updated for the given user on the given node.',
                            example: {
                                read: true,
                                write: true,
                                admin: true,
                            },
                            properties: {
                                read: {
                                    type: 'boolean',
                                    example: true,
                                    description: '`true` to allow, `false` to disallow',
                                },
                                write: {
                                    type: 'boolean',
                                    example: true,
                                    description: '`true` to allow, `false` to disallow',
                                },
                                admin: {
                                    type: 'boolean',
                                    example: true,
                                    description: '`true` to allow, `false` to disallow',
                                },
                            },
                        },
                    },
                    inherit: {
                        type: 'object',
                        description:
                            'Represents right inheritance for the given node from another node denoted in the `from` property. All rights of the given node are deleted and copied from the other node.',
                        example: {
                            from: '6da76147-c72a-4819-8efe-f4f8e06b6be6',
                        },
                        properties: {
                            from: {
                                type: 'string',
                                description: 'the node id of the node from which the rights should be copied.',
                            },
                        },
                        required: ['from'],
                    },
                },
            },
        },
        files: {
            type: 'object',
            description: '`id`s: A node `id` hashmap representing all nodes which files should be uploaded for.',
            example: {
                'e1d05e83-4122-4fd9-9502-d12e7867b4d6': {
                    someVideo: {
                        filename: 'my-video.mp4',
                        contentType: 'video/mp4',
                        fileSize: 25000000,
                        partSize: 5242880,
                    },
                    someTextFile: {
                        filename: 'my-file.txt',
                        contentType: 'text/plain',
                        fileSize: 250,
                    },
                },
            },
            additionalProperties: {
                type: 'object',
                description:
                    '`propName`s: A `propName` hashmap representing all properties which files should be attached with on the given node.',
                example: {
                    someVideo: {
                        filename: 'my-video.mp4',
                        contentType: 'video/mp4',
                        fileSize: 25000000,
                        partSize: 5242880,
                    },
                },
                additionalProperties: {
                    oneOf: [
                        { type: 'boolean', const: false, description: '`false` when the file should be deleted.' },
                        {
                            type: 'object',
                            description: 'File metadata describing the upload to be initialized.',
                            example: {
                                filename: 'my-video.mp4',
                                contentType: 'video/mp4',
                                fileSize: 25000000,
                                partSize: 5242880,
                            },
                            properties: {
                                filename: {
                                    type: 'string',
                                    example: 'my-video.mp4',
                                    description:
                                        'The filename as uploaded to the server and presented by the signed URL during download.',
                                    minLength: 1,
                                },
                                contentType: {
                                    type: 'string',
                                    example: 'video/mp4',
                                    description: 'Mime type of the file to upload.',
                                    minLength: 1,
                                },
                                fileSize: {
                                    type: 'integer',
                                    example: 25000000,
                                    description: 'Size of the file to be uploaded in bytes',
                                    minimum: 1,
                                },
                                partSize: {
                                    type: 'integer',
                                    example: 5242880,
                                    default: 5242880,
                                    description: 'Intended part size in bytes in case of a multipart upload.',
                                    minimum: 5242880,
                                },
                            },
                            required: ['filename', 'contentType', 'fileSize'],
                        },
                    ],
                },
            },
        },
    },
};

export type Body = Graph;

const locations = {
    NODES: BUCKET_NODES,
    EDGES: BUCKET_EDGES,
    REVERSE_EDGES: BUCKET_REVERSE_EDGES,
    RIGHTS_READ: BUCKET_RIGHTS_READ,
    RIGHTS_WRITE: BUCKET_RIGHTS_WRITE,
    RIGHTS_ADMIN: BUCKET_RIGHTS_ADMIN,
    OWNERS: BUCKET_OWNERS,
    MEDIA: BUCKET_MEDIA,
    LOGS: BUCKET_LOGS,
};

const handle = async (
    { userEmail, asAdmin, asRole, body }: AuthedValidationResult<Body>,
    context: Context,
): Promise<APIGatewayProxyResult> => {
    const storage = new S3Storage();
    const signer = await cfSigner();
    const graphService = new GraphService(storage, locations);
    const rightsService = new RightsService(storage, locations);
    const fileService = new FileService(storage, locations);
    const logsService = new PushLogsService(storage, locations);

    const [result, changelog] = await push(body, userEmail, asRole || 'user', asAdmin, {
        dataCache: createDataCache(),
        graphAssembler: graphAssembler(),
        changelogAssembler: graphAssembler(),
        graphService,
        rightsService,
        fileService,
        signer,
    });

    await logsService.setPushLog(userEmail, context.awsRequestId, changelog);

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: result,
    };
};

export const handleHttp: APIGatewayProxyHandler = async (event, context) => {
    try {
        const validationResult = await validateAuthed<Body>(schema, event);
        const result = await handle(validationResult, context);
        return result;
    } catch (err) {
        console.log(err);
        return internalServerError(err as Error);
    }
};

export const handleInvoke: Handler = async ({ body }, context) => {
    try {
        const result = await handle(body as AuthedValidationResult<Body>, context);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

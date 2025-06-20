import { CORS_HEADERS, internalServerError } from '@gothub/aws-util';
import type { View } from '@gothub/got-core';
import type { APIGatewayProxyHandler, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { pull } from '../pull';
import { graphAssembler } from '../pull/util/graphAssembler';
import { s3loader } from '../pull/util/s3loader';
import type { Signer } from '../pull/types/signer';
import { cfSigner } from '../pull/util/signer';
import { createDataCache } from '../pull/caches/dataCache';
import { validateAuthed, type AuthedValidationResult } from '@gothub/aws-util/validation';
import { FileService } from '../shared/files.service';
import { S3Storage } from '@gothub/aws-util/s3';
import { BUCKET_MEDIA } from '../pull/config';

export const querySchema = (recursiveRef: { $ref: string }) => ({
    type: 'object',
    description:
        'Holds a query object that specifies how the graph should be queried from a given entry point. The entry point can be a node ID or an edge pointing do a set of nodes',
    additionalProperties: false,
    properties: {
        as: {
            type: 'string',
            description: 'Defines an optional alias for the query object, which is currently ignored by the API.',
        },
        role: {
            type: 'string',
            description:
                'Defines the role which will be used to check the rights of the given node. If no role is given, the rights of the current user will be used.',
        },
        reverse: {
            type: 'boolean',
            description: 'Defines if the edge should be read out in reverse',
        },
        edges: {
            type: 'object',
            description:
                'Specifies a hashmap of edge types `fromType/toType` which should further be fetched from a given node or another parent edge query.',
            additionalProperties: recursiveRef,
        },
        include: {
            type: 'object',
            description:
                'Specifies which data should be returned for the given node or for multiple nodes the given edge type (e.g. "todo-app/todo-list") is pointing to',
            additionalProperties: false,
            example: {
                node: true,
                metadata: true,
                rights: true,
                files: false,
                edges: false,
            },
            properties: {
                node: {
                    type: 'boolean',
                    description:
                        '`true` when the node(s) data should be included in the response. `false` when they should explicitly be excluded from the response.',
                },
                edges: {
                    type: 'boolean',
                    description:
                        '`true` when the edges should be included in the response. `false` when they should explicitly be excluded from the response.',
                },
                metadata: {
                    type: 'boolean',
                    description:
                        '`true` when edge metadata data should be included in the response. `false` when they should explicitly be excluded from the response.',
                },
                rights: {
                    type: 'boolean',
                    description:
                        '`true` when the node rights should be included in the response. `false` when they should explicitly be excluded from the response.',
                },
                files: {
                    type: 'boolean',
                    description:
                        '`true` when the node files should be included in the response. `false` when they should explicitly be excluded from the response.',
                },
            },
        },
    },
});

export const schema = {
    type: 'object',
    additionalProperties: {
        $ref: '#/definitions/Query',
    },
    definitions: {
        Query: querySchema({
            $ref: '#/definitions/Query',
        }),
    },
};

export type Body = View;

const handle = async ({ userEmail, asAdmin, body }: AuthedValidationResult<Body>): Promise<APIGatewayProxyResult> => {
    const storage = new S3Storage();
    const signer: Signer = await cfSigner();
    const fileService = new FileService(storage, {
        MEDIA: BUCKET_MEDIA,
    });
    const [result] = await pull(body, userEmail, asAdmin, {
        dataCache: createDataCache(),
        graphAssembler: graphAssembler(),
        loader: s3loader(),
        fileService,
        signer,
    });

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: result,
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

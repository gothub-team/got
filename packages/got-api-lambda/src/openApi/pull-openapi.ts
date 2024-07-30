export const pullOpenApi = {
    summary: 'Pull Graph',
    security: [{ BearerAuth: [] }],
    description: 'This operation pulls a graph based on a given hashmap of queries.',
    operationId: 'pull',
    responses: {
        200: {
            description: 'OK',
        },
        400: {
            description: 'Bad Request',
        },
        401: {
            description: 'Unauthorized',
        },
    },
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    example: {
                        'd2c33f10-06e9-40bb-92e5-1fc4aaa58f95': {
                            edges: {
                                'todo-app/todo-list': {
                                    include: {
                                        node: true,
                                        rights: true,
                                        files: true,
                                        metadata: true,
                                    },
                                    edges: {
                                        'todo-list/todo': {
                                            include: {
                                                node: true,
                                                metadata: true,
                                                rights: true,
                                                files: true,
                                            },
                                        },
                                        'node/video': {
                                            include: {
                                                node: true,
                                                metadata: true,
                                                rights: true,
                                                files: true,
                                            },
                                        },
                                    },
                                },
                                'todo-app/feedback': {
                                    include: {
                                        edges: true,
                                        rights: true,
                                    },
                                },
                            },
                        },
                        '64fcd6b1-7efe-483f-a4bb-748f5544e2da': {
                            edges: {
                                'todo-app/info': {
                                    include: {
                                        metadata: true,
                                    },
                                },
                            },
                        },
                        'ccfcaab1-88fb-4358-baca-f9fca0074ad0': {
                            include: {
                                node: true,
                            },
                        },
                    },
                    additionalProperties: {
                        $ref: '#/components/schemas/Query',
                    },
                },
            },
        },
    },
};

import { schema } from '../handler/completeUpload';

export const completeUploadOpenApi = {
    summary: 'Complete Multipart Upload',
    security: [{ BearerAuth: [] }],
    description:
        'This operation completes a previously executed multipart upload. Multipart uploads are initiated via push operations.',
    operationId: 'completeUpload',
    tags: ['Media'],
    responses: {
        204: {
            description: 'Created.',
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
                schema: schema,
            },
        },
    },
};

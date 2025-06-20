import { CORS_HEADERS, MemoryStorage } from '@gothub/aws-util';
import type { AuthedValidationResult } from '@gothub/aws-util/validation';
import { createDataCache } from '../push/caches/dataCache';
import { graphAssembler } from '../push/util/graphAssembler';
import type { Loader as PullLoader } from '../pull/types/loader';
import { push } from '../push';
import type { Graph, View } from '@gothub/got-core';
import { json, type RequestHandler } from 'express';
import polka from 'polka';
import { pull } from '../pull';
import { ConfigurableWriter } from '../push/util/writer';
import { ConfigurableLoader } from '../push/util/loader';
import { mockSigner } from './signer.mock';
import { PushLogsService } from '../shared/push-logs.service';

const PORT = process.env.PORT || 4000;

const storage = new MemoryStorage();
const locations = {
    NODES: 'NODES',
    EDGES: 'EDGES',
    REVERSE_EDGES: 'REVERSE_EDGES',
    RIGHTS_READ: 'RIGHTS_READ',
    RIGHTS_WRITE: 'RIGHTS_WRITE',
    RIGHTS_ADMIN: 'RIGHTS_ADMIN',
    OWNERS: 'OWNERS',
    MEDIA: 'MEDIA',
    LOGS: 'LOGS',
};

const handlePush = async (
    { userEmail, asAdmin, asRole, body }: AuthedValidationResult<Body>,
    context: { awsRequestId: string },
) => {
    // TODO: replace with inert dependencies
    const signer = await mockSigner();
    const loader = new ConfigurableLoader(storage, locations);
    const writer = new ConfigurableWriter(storage, locations);
    const logsService = new PushLogsService(storage, locations);
    const [result, changelog] = await push(body as Graph, userEmail, asRole || 'user', asAdmin, {
        dataCache: createDataCache(),
        graphAssembler: graphAssembler(),
        changelogAssembler: graphAssembler(),
        loader: loader,
        writer: writer,
        signer,
    });

    await logsService.setPushLog(userEmail, context.awsRequestId, changelog);

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: result,
    };
};

const handlePull = async ({ userEmail, asAdmin, body }: AuthedValidationResult<Body>) => {
    const signer = await mockSigner();
    // TODO: refactor for common dependency between push and pull
    const loader = new ConfigurableLoader(storage, locations) as unknown as PullLoader;

    const [result] = await pull(body as unknown as View, userEmail, asAdmin, {
        dataCache: createDataCache(),
        graphAssembler: graphAssembler(),
        loader,
        signer,
    });

    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: result,
    };
};

const handleLogs = async ({ userEmail, body }: AuthedValidationResult<Body>) => {
    const { id, prefix = '' } = body as {
        id?: string;
        prefix?: string;
    };

    const logsService = new PushLogsService(storage, locations);
    if (id) {
        const log = await logsService.getPushLog(userEmail, id);
        if (log === undefined) {
            return {
                statusCode: 404,
                headers: CORS_HEADERS,
                body: JSON.stringify({ message: 'Log not found' }),
            };
        }

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: log?.toString() ?? '{}',
        };
    }

    const logs = await logsService.listPushLogs(userEmail, prefix);
    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(logs),
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;

type Result = {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
    requestTime?: number;
};

type CustomRequestHandler = ReplaceReturnType<RequestHandler, Result | Promise<Result>>;

export const handleResponse =
    (handler: CustomRequestHandler): RequestHandler =>
    async (req, res) => {
        try {
            console.log('handle request', req.url, req.headers['x-test-user'], req.body);
            const { statusCode = 200, body = '' } = (await handler(req, res, () => {})) || {}; // TODO: i added empty function to make typescript happy
            res.statusCode = statusCode;
            res.end(body);
        } catch (error) {
            console.log('error', error);
            const {
                statusCode = 400,
                // headers = {},
                body = '',
            } = error as Result;
            // res.set(headers);
            res.statusCode = statusCode;
            res.end(body);
        }
    };

const run = async () => {
    const server = polka();

    server.use(json({ limit: 260000 }));

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    const _handlePush: CustomRequestHandler = async (req) => {
        const userEmail = req.headers['x-test-user'];
        const asRole = req.headers['x-as-role'] as string | undefined;
        // @ts-expect-error TODO: correct types
        const res = await handlePush({ userEmail, asRole, asAdmin: false, body: req.body }, { awsRequestId: '123123' });
        return {
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.body,
        };
    };

    server.post('/push', handleResponse(_handlePush));

    const _handlePull: CustomRequestHandler = async (req) => {
        const userEmail = req.headers['x-test-user'];
        // @ts-expect-error TODO: correct types
        const res = await handlePull({ userEmail, asAdmin: false, body: req.body }, { awsRequestId: '123123' }); // TODO: support role
        return {
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.body,
        };
    };

    server.post('/pull', handleResponse(_handlePull));

    const _handleLogs: CustomRequestHandler = async (req) => {
        const userEmail = req.headers['x-test-user'];
        // @ts-expect-error TODO: correct types
        const res = await handleLogs({ userEmail, body: req.body });
        return {
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.body,
        };
    };

    server.post('/get-logs', handleResponse(_handleLogs));
};

void run();

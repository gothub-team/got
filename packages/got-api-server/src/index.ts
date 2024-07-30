import * as os from 'os';
import * as v8 from 'v8';
import equals from 'fast-deep-equal';
import polka from 'polka';
import type { Graph, View } from '@gothub/got-core';
import { json } from 'body-parser';
import type { RequestHandler } from 'express';
import type { Signer } from './types/signer';
import type { LogBody } from './handler/handleLog';
import { handleLog } from './handler/handleLog';
import { createExistsCache } from './caches/existsCache';
import { createDataCache } from './caches/dataCache';
import { initCaches } from './caches/initCaches';
import { pull } from './handler/pull';
import { createLogsCache } from './caches/logsCache';
import { cfSigner } from './util/signer';
import { s3loader } from './util/s3loader';
import { graphAssembler } from './util/graphAssembler';
import { initPull } from './handler/initPull';
import { graphWithoutUrls } from './util/graphWithoutUrls';

const PORT = process.env.PORT || 4000;

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
            console.log(`${req.url} | ${logMemory()}`);
            // console.log(JSON.stringify(req.body));
            const start = performance.now();
            const {
                statusCode = 200,
                requestTime,
                // headers = {},
                body = '',
            } = (await handler(req, res, () => {})) || {}; // TODO: i added empty function to make typescript happy
            // res.set(headers);
            res.statusCode = statusCode;
            res.end(body);
            const requestTimeStr = requestTime ? `| Request time: ${requestTime.toFixed(2)}ms ` : '';
            console.log(
                `handled ${req.url} in ${(performance.now() - start).toFixed(2)}ms ${requestTimeStr}| Response ${(body.length / (1024 * 1024)).toFixed(2)} MB | ${logMemory()}`,
            );
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
    console.log(`Server starting up | version: 0.2.23 | ${logMemory()}`);

    const existsCache = createExistsCache();
    const dataCache = createDataCache();
    const logsCache = createLogsCache();

    const signer: Signer = await cfSigner();

    const server = polka();

    console.log('init caches...');
    await initCaches(existsCache, dataCache);

    server.use(json({ limit: 260000 }));

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    const handlePull: CustomRequestHandler = async (req) => {
        const { body, userEmail, asAdmin } = req.body as { body: View; userEmail: string; asAdmin: boolean };

        try {
            const [result, log] = await pull(body, userEmail, asAdmin, {
                existsCache,
                dataCache,
                signer,
                loader: s3loader(),
                graphAssembler: graphAssembler(),
            });

            if (log.request.time < 1000) {
                logsCache.addLog(log);
            }

            return {
                statusCode: 200,
                requestTime: log.request.time,
                headers: {},
                body: result,
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers: {},
                body: '',
            };
        }
    };

    server.post('/dev/pull', handleResponse(handlePull));

    const handlePullCompare: CustomRequestHandler = async (req) => {
        const { body, userEmail, asAdmin, pullRes } = req.body as {
            body: View;
            userEmail: string;
            asAdmin: boolean;
            pullRes: string;
        };

        try {
            const [result, log] = await pull(body, userEmail, asAdmin, {
                existsCache,
                dataCache,
                signer,
                loader: s3loader(),
                graphAssembler: graphAssembler(),
            });

            if (log.request.time < 1000) {
                logsCache.addLog(log);
            }

            try {
                if (pullRes === result) {
                    console.log('Pulls are equal string');
                } else if (
                    equals(
                        graphWithoutUrls(JSON.parse(result) as Graph),
                        graphWithoutUrls(JSON.parse(pullRes) as Graph),
                    )
                ) {
                    console.log('Pulls are equal object');
                } else {
                    console.log('Pulls are not equal', JSON.stringify({ view: body, pullRes, result }));
                }
            } catch (err) {
                console.log('Pulls are not equal or error');
                console.log(err);
            }

            return {
                statusCode: 200,
                requestTime: log.request.time,
                headers: {},
                body: '',
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers: {},
                body: '',
            };
        }
    };

    server.post('/dev/pull-compare', handleResponse(handlePullCompare));

    const handleLogRequestHandler: CustomRequestHandler = async (req) => {
        try {
            await handleLog(req.body as LogBody, { dataCache, existsCache });
            return {
                statusCode: 200,
                headers: {},
                body: '{}',
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers: {},
                body: '',
            };
        }
    };

    server.post('/dev/handle-log', handleResponse(handleLogRequestHandler));

    const logRequestHandler: CustomRequestHandler = () => {
        const avg = logsCache.getAvg();
        console.log(JSON.stringify(avg, null, 2));
        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(avg),
        };
    };

    server.post('/dev/log', handleResponse(logRequestHandler));

    console.log('successfully set up endpoints');

    await initPull(existsCache, dataCache, signer, s3loader());

    console.log('server successfully initialized');

    console.log(logMemory());
    setInterval(() => console.log(logMemory()), 1000 * 60 * 5); // every 5 minutes
};

const logMemory = () => {
    // uptime and memory usage of system
    const systemUptime = os.uptime();
    const totalMemory = (os.totalmem() / (1024 * 1024)).toFixed(2); // in MBs
    const freeMemory = (os.freemem() / (1024 * 1024)).toFixed(2); // in MBs
    const usedMemory = (Number(totalMemory) - Number(freeMemory)).toFixed(2);

    // uptime and memory usage of process
    const processUptime = Math.floor(process.uptime());
    const processMemoryUsage = process.memoryUsage();
    const processMemoryUsed = (processMemoryUsage.rss / (1024 * 1024)).toFixed(2); // in MBs
    const processHeapTotal = (processMemoryUsage.heapTotal / (1024 * 1024)).toFixed(2); // in MBs
    const processHeapUsed = (processMemoryUsage.heapUsed / (1024 * 1024)).toFixed(2); // in MBs

    const memoryLimit = (v8.getHeapStatistics().heap_size_limit / (1024 * 1024)).toFixed(2);

    return `System uptime: ${systemUptime}s, Memory: ${usedMemory}/${totalMemory} MB, Process uptime: ${processUptime}s, Memory Limit: ${memoryLimit}, Memory Used: ${processMemoryUsed} MB, Heap: ${processHeapUsed}/${processHeapTotal} MB`;
};

void run();

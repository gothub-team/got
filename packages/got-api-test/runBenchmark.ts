import { parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW } from './env';
import { createUserApi } from './v1/shared';
import { type Graph, type View } from '@gothub/got-core';
import fs from 'fs/promises';
import equals from 'fast-deep-equal';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
});

const filePath = `${process.cwd()}/test-data.json`;
const outPath = `${process.cwd()}/out-data.json`;

const run = async () => {
    if (!(await fs.exists(filePath))) {
        console.log('Test data does not exists. Run setupBenchmark.ts first');
        return;
    }

    const str = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(str) as { rootNodeId: string; view: View; graph: Graph };

    const user1Email = env.TEST_USER_1_EMAIL;
    const user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);

    //run the pull once to prime any caches
    const primedGraph = await user1Api.pull(data.view);

    if (!equals(data.graph, primedGraph)) {
        console.log('Pulled graph is not equal to original graph');
        await fs.writeFile(outPath, JSON.stringify(primedGraph, null, 2));
        return;
    }

    const runs = 10;
    let totalTime = 0;

    for (let i = 0; i < runs; i++) {
        const start = performance.now();
        const pulledGraph = await user1Api.pull(data.view);
        totalTime += performance.now() - start;

        if (!equals(data.graph, pulledGraph)) {
            console.log(`Error on run ${i + 1}: Pulled graph is not equal to original graph`);
            return;
        }
    }

    console.log(`Average time: ${totalTime / runs}ms`);
};

run();

import { parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW } from './env';
import crypto from 'crypto';
import { createUserApi } from './v1/shared';
import { configureCreateLocalGraph } from '@gothub/got-core';
import type { StoreAPI } from '@gothub/got-core/dist/module/types/api';
import fs from 'fs/promises';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
});

const filePath = `${process.cwd()}/test-data.json`;

const run = async () => {
    if (await fs.exists(filePath)) {
        console.log('Test data already exists');
        return;
    }

    const testId = `test-${crypto.randomBytes(8).toString('hex')}`;

    const user1Email = env.TEST_USER_1_EMAIL;
    const user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);

    const { update, add, getGraph, push } = configureCreateLocalGraph(user1Api as StoreAPI, {})();

    let index = 0;
    const rootNode = { id: `${testId}-${index.toString().padStart(5, '0')}` };
    update(rootNode);
    index++;

    for (let i = 0; i < 10; i++) {
        const node = { id: `${testId}-${index.toString().padStart(5, '0')}` };
        add('from/to', rootNode.id, node, { index });
        index++;

        for (let j = 0; j < 10; j++) {
            const subNode = { id: `${testId}-${index.toString().padStart(5, '0')}` };
            add('from/to', node.id, subNode, { index });
            index++;
        }
    }

    const graph = getGraph();
    delete graph.index;

    const data = {
        rootNodeId: rootNode.id,
        view: {
            [rootNode.id]: {
                include: { node: true },
                edges: {
                    'from/to': {
                        include: { node: true, edges: true, metadata: true },
                        edges: {
                            'from/to': {
                                include: { node: true, edges: true, metadata: true },
                            },
                        },
                    },
                },
            },
        },
        graph,
    };

    const start = performance.now();
    await push();
    const end = performance.now();
    console.log(`Pushed graph in ${end - start}ms`);

    await fs.writeFile(filePath, JSON.stringify(data, null, 4));
};

run();

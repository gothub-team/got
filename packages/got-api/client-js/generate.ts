import * as R from 'ramda';
import * as fs from 'fs';
import { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } from 'quicktype-core';
import type { OpenAPIV3_1 } from 'openapi-types';
import { env } from '../env';

type Operation = {
    method: string;
    path: string;
    operationId: string;
} & OpenAPIV3_1.OperationObject;

type Response = OpenAPIV3_1.ResponseObject;

const promiseAll = <T>(ps: Promise<T>[]): Promise<T[]> => Promise.all(ps);
const mapObj =
    <T, O extends Record<string, T>, R>(fnMap: (key: string, obj: T) => R) =>
    (obj: O) =>
        R.compose(
            R.map((key: string | number | symbol) => fnMap(key as string, R.prop(key as string, obj))),
            R.keys,
        )(obj);

const typescriptInterface = async (typeName: string, jsonSchemaString: string) => {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());

    // We could add multiple schemas for multiple types,
    // but here we're just making one type from JSON schema.
    await schemaInput.addSource({ name: typeName, schema: jsonSchemaString });

    const inputData = new InputData();
    inputData.addInput(schemaInput);

    const result = await quicktype({
        inputData,
        lang: 'typescript',
        rendererOptions: { 'just-types': 'true' },
    });
    return result.lines.join('\n');
};

const capitalize = R.compose(R.join(''), R.over(R.lensIndex(0), R.toUpper)) as unknown as (val: string) => string;

const getOutputSchema = R.compose(
    R.head,
    mapObj((_: string, r: Response) => R.compose(R.path(['content', 'application/json', 'schema']))(r)),
    R.pickBy((_, status) => status < '400'),
);

(async () => {
    const schema = await fetch(`${env.GOT_API_URL}api`).then((res) => res.json());
    const operations = R.compose(
        R.flatten,
        mapObj((path: string, obj: unknown) =>
            mapObj((method: string, operation: unknown) => ({ ...(operation as Operation), path, method }))(
                obj as Operation,
            ),
        ),
        R.propOr({}, 'paths'),
    )(schema) as unknown as Operation[];

    const { components } = schema;

    const types = `import { post } from './fetch.js';
import type { Graph, View, PushBody, PushResult } from '@gothub-team/got-core';

export interface CreateLowApiOtions {
    /**
     * Host of got provider API to connect to. (e.g. https://api.gothub.io)
     */
    host: string,
    /**
     * Function to get the ID token which is used with all API requests that require authentication.
     */
    getIdToken: () => Promise<string | undefined>,
    /**
     * Function to get whether or not to call the API in admin mode.
     */
    getAdminMode: () => boolean,
}

export type CreateLowApiFn = (options: CreateLowApiOtions) => GotLowApi;

/** 
 * Creates the low level API which wraps all got REST API operations.
 */
export const createLowApi: CreateLowApiFn = ({ host, getIdToken = async () => '', getAdminMode = () => false }) => ({
${R.compose(
    R.join(''),
    R.map(
        ({ operationId, method, path, security }: Operation) =>
            `    ${operationId}: async input => ${method.toLowerCase()}(\`\${host}${path}\`, input${security ? ', await getIdToken(), getAdminMode()' : ''}),\n`,
    ),
)(operations)}});

export interface GotLowApi {
${R.compose(
    R.join(''),
    R.map(({ operationId, description, responses }: Operation) => {
        const identifier = capitalize(operationId);
        const errorResponses = R.compose(
            R.flatten,
            mapObj((status, r) =>
                R.compose(
                    R.map(R.assoc('status', status)),
                    R.pathOr([], ['content', 'application/json', 'schema', 'enum']),
                )(r),
            ),
            R.pickBy((_: string, status: string | number) => status >= '400'),
        )(responses) as unknown as { name: string; message: string }[];
        const outputSchema = getOutputSchema(responses);
        return `
    /**
     * ${description}
     * ${R.compose(
         R.join('\n     * '),
         R.flatten,
         R.map(({ name, message }) => [
             '@throws',
             '```JS',
             '{',
             `    name: '${name}',`,
             `    message: '${message}',`,
             '}',
             '```',
         ]),
     )(errorResponses)}
     */
    ${operationId}: (input: ${identifier}Input) => Promise<${outputSchema ? `${identifier}Output` : 'unknown'}>;\n`;
    }),
)(operations)}
}

export interface PullInput {
    /**
     * Hash map of node entry points into the query. Edges will be retrieved starting at the \`rootNodeId\`s
     */
    [rootNodeId: string]: Query;
}

${await R.compose(
    R.andThen(R.join('\n')),
    promiseAll,
    (a) => R.flatten(a as unknown[]) as Promise<string>[],
    R.map(({ operationId, requestBody, responses }: Operation) => {
        const identifier = capitalize(operationId);
        const inputSchema = R.compose(
            R.assoc('components', components),
            R.pathOr({}, ['content', 'application/json', 'schema']),
        )(requestBody);
        const outputSchema = getOutputSchema(responses);
        return [
            typescriptInterface(operationId === 'pull' ? 'Query' : `${identifier}Input`, JSON.stringify(inputSchema)),
            outputSchema && typescriptInterface(`${identifier}Output`, JSON.stringify(outputSchema)),
        ];
    }),
)(operations)}
`;

    fs.mkdirSync('./client-js', { recursive: true });
    fs.writeFileSync(
        './client-js/api.ts',
        types
            .replaceAll(/any/g, 'unknown')
            .replace('pull: (input: PullInput) => Promise<unknown>;', 'pull: (input: View) => Promise<Graph>;')
            .replace(
                'push: (input: PushInput) => Promise<unknown>;',
                'push: (input: PushBody) => Promise<PushResult>;',
            ),
        {},
    );
})();

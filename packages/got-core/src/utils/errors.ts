import { isEdgeTypeString } from './util';

export class MissingParamError extends Error {
    public missing: string;

    constructor(fnName: string, missing: string, example: string) {
        super(missingStr(fnName, missing, example));
        this.name = 'MissingParamError';
        this.missing = missing;
    }
}

export class InvalidParamError extends Error {
    public invalid: string;

    constructor(fnName: string, invalid: string, example: string) {
        super(invalidStr(fnName, invalid, example));
        this.name = 'InvalidParamError';
        this.invalid = invalid;
    }
}

type ParameterType =
    | 'api'
    | 'function'
    | 'stack'
    | 'string'
    | 'node'
    | 'edgeTypes'
    | 'blob'
    | 'view'
    | 'graph'
    | 'rights';

const missingStr = (fnName: string, missing: string, example: string) =>
    `${fnName}::Parameter '${missing}' is missing.${example ? `\nProvide parameter like:\n\n '${example}'.` : ''}`;
const invalidStr = (fnName: string, invalid: string, example: string) =>
    `${fnName}::Parameter '${invalid}' is invalid.${example ? `\nProvide parameter like:\n\n '${example}'.` : ''}`;

const examples: Partial<Record<ParameterType, string>> = {
    view: JSON.stringify(
        {
            'todo-list1': {
                include: {
                    node: true,
                    rights: true,
                },
                edges: {
                    'todo-list/todo': {
                        include: {
                            edges: true,
                            metadata: true,
                        },
                    },
                },
            },
        },
        null,
        2,
    ),
    graph: JSON.stringify(
        {
            nodes: {
                node1: {
                    id: 'node1',
                    someProp: 'someValue',
                },
            },
        },
        null,
        2,
    ),
    node: JSON.stringify(
        {
            id: 'todo123',
            text: 'buy groceries',
        },
        null,
        2,
    ),
    rights: JSON.stringify(
        {
            read: true,
            write: true,
            admin: false,
        },
        null,
        2,
    ),
};

const validate = (type: ParameterType, value: any) => {
    switch (type) {
        case 'api':
            return value && value.pull && value.push;
        case 'function':
            return value && typeof value === 'function';
        case 'stack':
            return value && Array.isArray(value) && value.length > 0;
        case 'string':
            return value && typeof value === 'string' && value.length > 0;
        case 'node':
            return value && typeof value === 'object' && value.id;
        case 'edgeTypes':
            return value && typeof value === 'string' && isEdgeTypeString(value);
        case 'view':
        case 'graph':
        case 'rights':
            return value && typeof value === 'object';
    }
};

export const validateInput =
    (onError: (error: Error) => void) => (fnName: string, type: ParameterType, input: object) => {
        const keys = Object.keys(input);
        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            const value = input[key];
            if (value === undefined) {
                onError(new MissingParamError(fnName, key, examples[type] || ''));
            } else if (!validate(type, value)) {
                onError(new InvalidParamError(fnName, key, examples[type] || ''));
            }
        }
    };

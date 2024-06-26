export type Subscriber<TEvent> = {
    next?: (e: TEvent) => void;
    complete?: (e?: TEvent) => void;
    error?: (e: TEvent) => void;
};

type Observable<TEvent> = {
    subscribe: (sub: Subscriber<TEvent> | ((e: TEvent) => void)) => () => void;
    unsubscribe: (sub: Subscriber<TEvent>) => void;
};

/**
 * Collects all Subscribers and handles calling of their handlers when handlers of the returned subscriber are invoked.
 */
export const createSubscribable = <TEvent>() => {
    let subscribers: Subscriber<TEvent>[] = [];
    const subscribe = (sub: Subscriber<TEvent> | ((e: TEvent) => void)) => {
        const _sub = typeof sub === 'function' ? ({ next: sub, complete: sub } as Subscriber<TEvent>) : sub;
        subscribers.push(_sub);
        return () => unsubscribe(_sub);
    };

    const unsubscribe = (sub: Subscriber<TEvent>) => {
        subscribers = subscribers.filter((s) => s !== sub);
    };

    const next = (e: TEvent) => {
        for (let i = 0; i < subscribers.length; i += 1) {
            const fn = subscribers[i]?.next;
            try {
                fn && fn(e);
            } catch (err) {
                console.error(err);
            }
        }
    };
    const complete = (e?: TEvent) => {
        for (let i = 0; i < subscribers.length; i += 1) {
            const fn = subscribers[i]?.complete;
            try {
                fn && fn(e);
            } catch (err) {
                console.error(err);
            }
        }
    };
    const error = (e: TEvent) => {
        for (let i = 0; i < subscribers.length; i += 1) {
            const fn = subscribers[i]?.error;
            try {
                fn && fn(e);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const subscriber: Subscriber<TEvent> = { next, complete, error };

    return { subscribe, unsubscribe, subscriber };
};

/**
 * Creates a promise that will resolve when a complete event is recieved or rejects when an error event is recieved
 * from the input observable.
 *
 * @returns an array of recieved events.
 */
export const toPromise = <TEvent>(observable: Observable<TEvent>) =>
    new Promise((resolve, reject) => {
        const results: TEvent[] = [];
        observable.subscribe({
            next: results.push,
            complete: (e?: TEvent) => {
                e && results.push(e);
                resolve(results);
            },
            error: (e: TEvent) => {
                results.push(e);
                reject(results);
            },
        });
    });

/**
 * Merges two objects with props of the right input taking priority over those of the left.
 */
export const mergeGraphObjRight = <TGraphObj>(left: TGraphObj, right: TGraphObj) => {
    // right does not overwrite
    if (right === undefined) {
        return left;
    }

    // right is false or null and overwrites
    if (!right) {
        return right;
    }

    // right is true, take truthy left or overwrite with true
    if (right === true) {
        return left || right;
    }

    // right is object

    // if left is falsy or true, overwrite
    if (!left || left === true) {
        return right;
    }

    // left is also object, merge
    return { ...left, ...right };
};

/**
 * Deep merges two objects with data of the right input taking priority over those of the left.
 */
export const mergeDeepRight = (l: unknown, r: unknown) => {
    if (typeof l !== 'object' || typeof r !== 'object' || l === null || r === null) return r;

    const result: Record<string, unknown> = {};

    const lKeys = Object.keys(l);
    for (let i = 0; i < lKeys.length; i += 1) {
        const key = lKeys[i];
        const lVal = (l as Record<string, unknown>)[key];
        const rVal = (r as Record<string, unknown>)[key];
        result[key] = key in r ? mergeDeepRight(lVal, rVal) : lVal;
    }

    const rKeys = Object.keys(r);
    for (let i = 0; i < rKeys.length; i += 1) {
        const key = rKeys[i];
        if (!(key in result)) {
            result[key] = (r as Record<string, unknown>)[key];
        }
    }

    return result;
};

/**
 * Traverses an object to the given depth and calls fnMap with every value and path found.
 */
export const forEachObjDepth = <TForEach>(
    obj: Record<string, unknown> | undefined,
    fnForEach: (val: TForEach, path: string[]) => void,
    depth: number = 1,
    path: string[] = [],
) => {
    if (!obj) return;

    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const val = obj[key];
        if (depth === 1) {
            fnForEach(val as TForEach, [...path, key]);
        } else if (val && typeof val === 'object') {
            forEachObjDepth(val as Record<string, unknown>, fnForEach, depth - 1, [...path, key]);
        }
    }
};

export const getPathOr = <TInput extends Record<string, unknown>, TRes>(
    or: TRes | undefined,
    path: string[],
    input: TInput | undefined,
): TRes | undefined => {
    if (!input) return or;

    try {
        let obj: Record<string, unknown> = input;
        for (let i = 0; i < path.length; i += 1) {
            const key = path[i];
            if (key in obj) {
                obj = obj[key] as Record<string, unknown>;
            } else {
                return or;
            }
        }
        return obj as unknown as TRes;
    } catch (err) {
        return or;
    }
};

/**
 * Will mutate an object and assoc the given value at the specified path, creating objects along the way if they don't exist yet.
 *
 * @returns the mutated object
 */
export const assocPathMutate = <TInput extends Record<string, unknown>, TVal, TPath extends string[]>(
    path: TPath,
    val: TVal,
    input: TInput,
): TPath['length'] extends 0 ? TVal : TInput => {
    if (path.length === 0) {
        return val as TPath['length'] extends 0 ? TVal : TInput;
    }
    let obj: Record<string, unknown> = input;
    for (let i = 0; i < path.length - 1; i += 1) {
        const prop = path[i];
        if (prop in obj) {
            obj = obj[prop] as Record<string, unknown>;
        } else {
            obj[prop] = {};
            obj = obj[prop] as Record<string, unknown>;
        }
    }

    const lastProp = path[path.length - 1];
    obj[lastProp] = val;

    return input as TPath['length'] extends 0 ? TVal : TInput;
};

/**
 * Will mutate an object and delete the given value at the specified path.
 *
 * @returns the mutated object
 */
export const dissocPathMutate = <TInput extends Record<string, unknown>>(path: string[], input: TInput) => {
    let obj: Record<string, unknown> = input;
    for (let i = 0; i < path.length - 1; i += 1) {
        const prop = path[i];
        if (prop in obj) {
            obj = obj[prop] as Record<string, unknown>;
        } else {
            obj[prop] = {};
            obj = obj[prop] as Record<string, unknown>;
        }
    }

    const lastProp = path[path.length - 1];
    delete obj[lastProp];

    return input;
};

export const isEdgeTypeString = (edgeTypes: string) => {
    const [fromType, toType] = edgeTypes.split('/');
    return fromType && toType;
};

export const isEmptyObject = (obj: object | undefined): boolean => {
    return obj === undefined || Object.keys(obj).length === 0;
};

export const decideStack = (stack: string[] | string[1][]): string[] => {
    if (stack.length === 0) return [];
    if (stack.length === 1 && Array.isArray(stack[0])) {
        return stack[0];
    }
    return stack;
};

type Subscriber<TEvent> = {
    next?: (e: TEvent) => void;
    complete?: (e: TEvent) => void;
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
        const _sub = typeof sub === 'function' ? { next: sub, complete: sub } : sub;
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
    const complete = (e: TEvent) => {
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

    return { subscribe, unsubscribe, subscriber: { next, complete, error } };
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
            complete: (e: TEvent) => {
                results.push(e);
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
    if (typeof l !== 'object' || typeof r !== 'object') return r;

    const result = {};

    const lKeys = Object.keys(l);
    for (let i = 0; i < lKeys.length; i += 1) {
        const key = lKeys[i];
        const lVal = l[key];
        const rVal = r[key];
        result[key] = key in r ? mergeDeepRight(lVal, rVal) : lVal;
    }

    const rKeys = Object.keys(r);
    for (let i = 0; i < rKeys.length; i += 1) {
        const key = rKeys[i];
        if (!(key in result)) {
            result[key] = r[key];
        }
    }

    return result;
};

/**
 * Traverses an object to the given depth and calls fnMap with every value and path found.
 */
export const forEachObjDepth = (
    obj: unknown,
    fnMap: (val: unknown, path: string[]) => void,
    depth: number = 1,
    path: string[] = [],
) => {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const val = obj[key];
        if (depth === 1) {
            fnMap(val, [...path, key]);
        } else {
            forEachObjDepth(val, fnMap, depth - 1, [...path, key]);
        }
    }
};

export const getPathOr = <TInput extends object, TRes>(
    or: TRes | undefined,
    path: string[],
    input: TInput,
): TRes | undefined => {
    try {
        let obj = input;
        for (let i = 0; i < path.length; i += 1) {
            const key = path[i];
            if (key in obj) {
                obj = obj[key];
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
export const assocPathMutate = <TInput extends object>(path: string[], val: unknown, input: TInput): TInput => {
    let obj = input;
    for (let i = 0; i < path.length - 1; i += 1) {
        const prop = path[i];
        if (prop in obj) {
            obj = obj[prop];
        } else {
            obj[prop] = {};
            obj = obj[prop];
        }
    }

    const lastProp = path[path.length - 1];
    obj[lastProp] = val;

    return input;
};

/**
 * Will mutate an object and delete the given value at the specified path.
 *
 * @returns the mutated object
 */
export const dissocPathMutate = <TInput extends object>(path: string[], input: TInput) => {
    let obj = input;
    for (let i = 0; i < path.length - 1; i += 1) {
        const prop = path[i];
        if (prop in obj) {
            obj = obj[prop];
        } else {
            obj[prop] = {};
            obj = obj[prop];
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

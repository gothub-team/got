// no ramda
// efficient and readable
// no curry
// no 'use'

type Subscriber<TEvent> = {
    next?: (e: TEvent) => void;
    complete?: (e: TEvent) => void;
    error?: (e: TEvent) => void;
};

type Observable<TEvent> = {
    subscribe: (sub: Subscriber<TEvent> | ((e: TEvent) => void)) => () => void;
    unsubscribe: (sub: Subscriber<TEvent>) => void;
};

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

export const toPromise = <TEvent>(observable: Observable<TEvent>) =>
    new Promise((resolve, reject) => {
        let results: TEvent[] = [];
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

export const mergeGraphObjRight = (left, right) => {
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

const mergeDeepRight = (l: unknown, r: unknown) => {
    if (typeof l !== 'object' || typeof r !== 'object') return r;

    const result = {};

    const lKeys = Object.keys(l);
    for (let i = 0; i < lKeys.length; i = +1) {
        const key = lKeys[i];
        const lVal = l[key];
        const rVal = r[key];
        result[key] = rVal !== undefined ? mergeDeepRight(lVal, rVal) : lVal;
    }

    const rKeys = Object.keys(r);
    for (let i = 0; i < rKeys.length; i = +1) {
        const key = rKeys[i];
        if (result[key] === undefined) {
            result[key] = r[key];
        }
    }

    return result;
};

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

// no ramda
// efficient and readable
// no curry
// no 'use'

type Subscriber<TEvent> = {
    next?: (e: TEvent) => void;
    complete?: (e: TEvent) => void;
    error?: (e: TEvent) => void;
};

export const createSubscribable = <TEvent>() => {
    let subscribers: Subscriber<TEvent>[] = [];
    const subscribe = (sub: Subscriber<TEvent> | ((e: TEvent) => void)) => {
        const _sub = typeof sub === 'function' ? { next: sub, complete: sub } : sub;
        subscribers.push(_sub);
        return { unsubscribe: () => unsubscribe(_sub) };
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

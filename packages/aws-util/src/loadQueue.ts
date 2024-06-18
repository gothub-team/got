type AsyncFn<T> = () => Promise<T>;

export const loadQueue = (maxActiveRequests = 100) => {
    const elements: Array<AsyncFn<unknown>> = [];
    let head = 0;
    let tail = 0;
    let activeRequests = 0;

    const enqueue = (element: AsyncFn<unknown>) => {
        elements[tail] = element;
        tail += 1;
    };

    const dequeue = (): AsyncFn<unknown> => {
        const element = elements[head];
        delete elements[head];
        head += 1;
        return element;
    };

    const length = () => tail - head;

    const queueLoad = <T>(fnLoad: () => Promise<T>): Promise<T> => {
        const promise: Promise<T> = new Promise((resolve, reject) => {
            const element = async () => {
                await fnLoad().then(resolve).catch(reject);
            };
            enqueue(element);
        });

        void checkQueue();

        return promise;
    };

    const checkQueue = async () => {
        if (activeRequests < maxActiveRequests && length() > 0) {
            const fnLoad = dequeue();
            activeRequests += 1;
            fnLoad && (await fnLoad());
            activeRequests -= 1;
            void checkQueue();
        }
    };

    return { queueLoad, length };
};

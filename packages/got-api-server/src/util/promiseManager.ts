export const promiseManager = () => {
    let promises: Promise<unknown>[] = [];

    const addPromise = <TRes>(promise: Promise<TRes>): Promise<TRes> => {
        promises.push(promise);
        return promise;
    };

    const awaitPromises = async () => {
        while (promises.length > 0) {
            console.log(`Awaiting ${promises.length} promises...`);
            const currPromises = promises;
            promises = [];
            await Promise.all(currPromises);
        }
    };

    return {
        addPromise,
        awaitPromises,
    };
};

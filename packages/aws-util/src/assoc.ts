const maybePropObject = (prop: string | number, object: Record<string | number, unknown>) => {
    let nextObject = object[prop] as Record<string | number, unknown> | undefined;

    if (!nextObject) {
        nextObject = {};
        object[prop] = nextObject;
    }

    return nextObject;
};

export const assoc1 = (prop1: string | number, value: unknown, object: Record<string | number, unknown>) => {
    object[prop1] = value;

    return object;
};

export const assoc2 = (
    prop1: string | number,
    prop2: string | number,
    value: unknown,
    object: Record<string | number, unknown>,
) => {
    const nextObject = maybePropObject(prop1, object);

    assoc1(prop2, value, nextObject);

    return object;
};

export const assoc3 = (
    prop1: string | number,
    prop2: string | number,
    prop3: string | number,
    value: unknown,
    object: Record<string | number, unknown>,
) => {
    const nextObject = maybePropObject(prop1, object);
    assoc2(prop2, prop3, value, nextObject);

    return object;
};

export const assoc4 = (
    prop1: string | number,
    prop2: string | number,
    prop3: string | number,
    prop4: string | number,
    value: unknown,
    object: Record<string | number, unknown>,
) => {
    const nextObject = maybePropObject(prop1, object);
    assoc3(prop2, prop3, prop4, value, nextObject);

    return object;
};

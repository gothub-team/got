const maybePropMap = (prop: string, map: Map<string, unknown>) => {
    let nextMap = map.get(prop) as Map<string, unknown> | undefined;

    if (!nextMap) {
        nextMap = new Map<string, unknown>();
        map.set(prop, nextMap);
    }

    return nextMap;
};

export const assocMap1 = (prop1: string, value: unknown, map: Map<string, unknown>) => {
    map.set(prop1, value);

    return map;
};

export const assocMap2 = (prop1: string, prop2: string, value: unknown, map: Map<string, unknown>) => {
    const nextMap = maybePropMap(prop1, map);

    assocMap1(prop2, value, nextMap);

    return map;
};

export const assocMap3 = (prop1: string, prop2: string, prop3: string, value: unknown, map: Map<string, unknown>) => {
    const nextMap = maybePropMap(prop1, map);
    assocMap2(prop2, prop3, value, nextMap);

    return map;
};

export const assocMap4 = (
    prop1: string,
    prop2: string,
    prop3: string,
    prop4: string,
    value: unknown,
    map: Map<string, unknown>,
) => {
    const nextMap = maybePropMap(prop1, map);
    assocMap3(prop2, prop3, prop4, value, nextMap);

    return map;
};

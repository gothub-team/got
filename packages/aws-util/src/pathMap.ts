export const pathMap2 = <TReturn>(prop1: string, prop2: string, map: Map<string, unknown>): TReturn | undefined => {
    const map1 = map.get(prop1) as Map<string, unknown> | undefined;
    if (map1 == null) {
        return undefined;
    }
    return map1.get(prop2) as TReturn | undefined;
};

export const pathMap3 = <TReturn>(
    prop1: string,
    prop2: string,
    prop3: string,
    map: Map<string, unknown>,
): TReturn | undefined => {
    const map1 = map.get(prop1) as Map<string, unknown> | undefined;
    if (map1 == null) {
        return undefined;
    }
    return pathMap2<TReturn>(prop2, prop3, map1);
};

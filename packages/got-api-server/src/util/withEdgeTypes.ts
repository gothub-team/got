import { type View } from '@gothub/got-core';

export type WithEdgeTypes = {
    fromType: string;
    toType: string;
};

export const withEdgeTypes = (view: View) => {
    if (view == null) return;

    const keys = Object.keys(view);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const queryObject = view[key];

        const [fromType, toType] = key.split('/');

        const objWithEdgeTypes = queryObject as WithEdgeTypes;
        objWithEdgeTypes.fromType = fromType;
        objWithEdgeTypes.toType = toType;

        const edges = queryObject.edges;
        if (edges != null) {
            withEdgeTypes(edges as View);
        }
    }
};

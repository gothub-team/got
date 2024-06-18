export type Changes = {
    old: unknown;
    new: unknown;
};

export type Changeset = {
    nodes?: {
        [id: string]: Changes;
    };
    edges?: {
        [fromType: string]: {
            [fromId: string]: {
                [toType: string]: {
                    [toId: string]: Changes;
                };
            };
        };
    };
    rights?: {
        [id: string]: {
            [principalType: string]: {
                [principal: string]: {
                    read?: Changes;
                    write?: Changes;
                    admin?: Changes;
                };
            };
        };
    };
};

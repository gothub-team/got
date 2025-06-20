// string that is any combination of "rwao"
export type RightsString = string;
export type EntityRights = Record<PropertyKey, RightsString>;

// NodeEntityRights are only used to get all rights for a node and to have a seperate copy of the data less prone to collisions
export type NodeEntityRights = { user: EntityRights; role: EntityRights };

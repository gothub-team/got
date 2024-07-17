import { assocMap2, assocMap3 } from '@gothub/aws-util';
import { type Rights, type ExistsCache, type RightType } from '../types/existCache';
import { pathMap2, pathMap3 } from '@gothub/aws-util';

export const createExistsCache: () => ExistsCache = () => {
    /* #region Nodes */
    const cacheNodes = new Map<string, boolean>(); // this could maybe be object, as read is slightly slower, but write is much faster

    const addNode = (id: string) => {
        cacheNodes.set(id, true);
    };

    const removeNode = (id: string) => {
        cacheNodes.delete(id);
    };

    const getNode = (id: string) => {
        return cacheNodes.has(id);
    };
    /* #endregion */

    /* #region Edges */
    const cacheEdges = new Map<string, Map<string, Map<string, boolean>>>();

    const addEdge = (fromId: string, edgeTypes: string, toId: string) => {
        assocMap3(fromId, edgeTypes, toId, true, cacheEdges);
    };

    const listEdge = (fromId: string, edgeTypes: string) => {
        return pathMap2<Map<string, boolean>>(fromId, edgeTypes, cacheEdges);
    };

    const removeEdge = (fromId: string, edgeTypes: string, toId: string) => {
        const toIds = listEdge(fromId, edgeTypes);
        if (toIds == null) return;

        toIds.delete(toId);
    };

    const getEdge = (fromId: string, edgeTypes: string, toId: string) => {
        return pathMap3<boolean>(fromId, edgeTypes, toId, cacheEdges) === true;
    };
    /* #endregion */

    /* #region Reverse Edges */
    const cacheEdgesReverse = new Map<string, Map<string, Map<string, boolean>>>();

    const addEdgeReverse = (toId: string, edgeTypes: string, fromId: string) => {
        assocMap3(toId, edgeTypes, fromId, true, cacheEdgesReverse);
    };

    const listEdgeReverse = (toId: string, edgeTypes: string) => {
        return pathMap2<Map<string, boolean>>(toId, edgeTypes, cacheEdgesReverse);
    };

    const removeEdgeReverse = (toId: string, edgeTypes: string, fromId: string) => {
        const toIds = listEdge(toId, edgeTypes);
        if (toIds == null) return;

        toIds.delete(fromId);
    };

    const getEdgeReverse = (toId: string, edgeTypes: string, fromId: string) => {
        return pathMap3<boolean>(toId, edgeTypes, fromId, cacheEdgesReverse) === true;
    };
    /* #endregion */

    /* #region User Rights */
    const cacheUserRights = new Map<string, Map<string, Rights>>();

    const addUserRight = (id: string, principal: string, right: RightType) => {
        let rights = pathMap2<Rights>(id, principal, cacheUserRights);

        if (rights == null) {
            rights = {};
            assocMap2(id, principal, rights, cacheUserRights);
        }

        if (right === 'read') {
            rights.read = 'true';
        } else if (right === 'write') {
            rights.write = 'true';
        } else if (right === 'admin') {
            rights.admin = 'true';
        }
    };

    const removeUserRight = (id: string, principal: string, right: RightType) => {
        const rights = pathMap2<Rights>(id, principal, cacheUserRights);

        if (rights == null) return;

        if (right === 'read') {
            delete rights.read;
        } else if (right === 'write') {
            delete rights.write;
        } else if (right === 'admin') {
            delete rights.admin;
        }
    };

    const getUserRead = (id: string, principal: string) => {
        const rights = pathMap2<Rights>(id, principal, cacheUserRights);

        if (rights == null) return false;

        return !!rights.read;
    };
    const getUserWrite = (id: string, principal: string) => {
        const rights = pathMap2<Rights>(id, principal, cacheUserRights);

        if (rights == null) return false;

        return !!rights.write;
    };

    const getUserAdmin = (id: string, principal: string) => {
        const rights = pathMap2<Rights>(id, principal, cacheUserRights);

        if (rights == null) return false;

        return !!rights.admin;
    };

    const listUserRights = (id: string) => {
        return cacheUserRights.get(id);
    };
    /* #endregion */

    /* #region Role Rights */
    const cacheRoleRights = new Map<string, Map<string, Rights>>();

    const addRoleRight = (id: string, principal: string, right: RightType) => {
        let rights = pathMap2<Rights>(id, principal, cacheRoleRights);

        if (rights == null) {
            rights = {};
            assocMap2(id, principal, rights, cacheRoleRights);
        }

        if (right === 'read') {
            rights.read = 'true';
        } else if (right === 'write') {
            rights.write = 'true';
        } else if (right === 'admin') {
            rights.admin = 'true';
        }
    };

    const removeRoleRight = (id: string, principal: string, right: RightType) => {
        const rights = pathMap2<Rights>(id, principal, cacheRoleRights);

        if (rights == null) return;

        if (right === 'read') {
            delete rights.read;
        } else if (right === 'write') {
            delete rights.write;
        } else if (right === 'admin') {
            delete rights.admin;
        }
    };

    const getRoleRead = (id: string, principal: string) => {
        const rights = pathMap2<Rights>(id, principal, cacheRoleRights);

        if (rights == null) return false;

        return !!rights.read;
    };

    const getRoleWrite = (id: string, principal: string) => {
        const rights = pathMap2<Rights>(id, principal, cacheRoleRights);

        if (rights == null) return false;

        return !!rights.write;
    };

    const getRoleAdmin = (id: string, principal: string) => {
        const rights = pathMap2<Rights>(id, principal, cacheRoleRights);

        if (rights == null) return false;

        return !!rights.admin;
    };

    const listRoleRights = (id: string) => {
        return cacheRoleRights.get(id);
    };
    /* #endregion */

    return {
        node: {
            addNode,
            removeNode,
            getNode,
        },
        edge: {
            addEdge,
            listEdge,
            removeEdge,
            getEdge,
        },
        edgeReverse: {
            addEdgeReverse,
            listEdgeReverse,
            removeEdgeReverse,
            getEdgeReverse,
        },
        userRights: {
            addRight: addUserRight,
            removeRight: removeUserRight,
            getRead: getUserRead,
            getWrite: getUserWrite,
            getAdmin: getUserAdmin,
            listRights: listUserRights,
        },
        roleRights: {
            addRight: addRoleRight,
            removeRight: removeRoleRight,
            getRead: getRoleRead,
            getWrite: getRoleWrite,
            getAdmin: getRoleAdmin,
            listRights: listRoleRights,
        },
    } satisfies ExistsCache;
};

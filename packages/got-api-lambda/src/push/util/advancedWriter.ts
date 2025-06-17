import { s3get, s3put } from '@gothub/aws-util/s3';
import type { RightTypes } from '@gothub/got-core';
import type { EntityRights, NodeEntityRights, RightsString } from './advanced.types';

const rightBucket = 'some-new-rights-bucket'; // TODO: Replace with actual bucket name

const modifyRight = (rights: RightsString, rightsPatch: RightTypes): RightsString => {
    let rightString: RightsString = '';

    // read
    if (rightsPatch.read !== false && (rightsPatch.read === true || rights.includes('r'))) {
        rightString += 'r';
    }

    // write
    if (rightsPatch.write !== false && (rightsPatch.write === true || rights.includes('w'))) {
        rightString += 'w';
    }

    // admin
    if (rightsPatch.admin !== false && (rightsPatch.admin === true || rights.includes('a'))) {
        rightString += 'a';
    }

    return rightString;
};

type RightsPatches = Record<PropertyKey, RightTypes>;
const applyRightsPatches = (rights: EntityRights, patches: RightsPatches) => {
    for (const [key, rightsPatch] of Object.entries(patches)) {
        const currentRights = rights[key] || '';

        const newRightsString = modifyRight(currentRights, rightsPatch);
        if (!newRightsString) {
            // If the new rights string is empty, we remove the principal from the rights
            delete rights[key];
        } else {
            // Otherwise, we update the rights for the principal
            rights[key] = modifyRight(currentRights, rightsPatch);
        }
    }
};

/**
 * first takes in a bunch of rights patches, then applies them to the current rights
 * Stateful, needs to be initialized for each request
 */
export class RightChangesManager {
    userRightPatches: Record<PropertyKey, RightsPatches> = {};
    roleRightPathes: Record<PropertyKey, RightsPatches> = {};

    nodeRightPatches: Record<
        PropertyKey,
        {
            user: RightsPatches;
            role: RightsPatches;
        }
    > = {};

    getPrincipalRights(principalType: 'user' | 'role', nodeId: string, principal: string) {
        if (principalType === 'user') {
            const userRightPatches = this.userRightPatches[principal] || {};
            this.userRightPatches[principal] = userRightPatches;

            const nodeRightPatches = userRightPatches[nodeId] || {};
            userRightPatches[nodeId] = nodeRightPatches;

            return nodeRightPatches;
        } else if (principalType === 'role') {
            const roleRightPatches = this.roleRightPathes[principal] || {};
            this.roleRightPathes[principal] = roleRightPatches;

            const nodeRightPatches = roleRightPatches[nodeId] || {};
            roleRightPatches[nodeId] = nodeRightPatches;

            return nodeRightPatches;
        }
        throw new Error(`Unknown principal type: ${principalType}`);
    }

    getNodeRights(principalType: 'user' | 'role', nodeId: string, principal: string) {
        const nodeRightPatches = this.nodeRightPatches[nodeId] || { user: {}, role: {} };
        this.nodeRightPatches[nodeId] = nodeRightPatches;

        const principalRights = nodeRightPatches[principalType];

        const principalPatch = principalRights[principal] || {};
        principalRights[principal] = principalPatch;

        return principalPatch;
    }

    setRight(
        rightType: keyof RightTypes,
        nodeId: string,
        principalType: 'user' | 'role',
        principal: string,
        right: boolean,
    ) {
        // set right for principal
        const principalPatch = this.getPrincipalRights(principalType, principal, nodeId);
        principalPatch[rightType] = right;
        // set right for node
        const nodePatch = this.getNodeRights(principalType, nodeId, principal);
        nodePatch[rightType] = right;
    }

    async loadRights<T>(key: string) {
        return s3get(rightBucket, key).then((buffer) => {
            if (!buffer) {
                return undefined;
            }
            return JSON.parse(buffer.toString()) as T;
        });
    }

    async storeRoleRight(roleId: string) {
        const rightKey = `role/${roleId}`;
        const roleRights = (await this.loadRights<EntityRights>(rightKey)) || ({} as EntityRights);

        const roleRightPatches = this.roleRightPathes[roleId];
        if (!roleRightPatches) {
            return;
        }

        applyRightsPatches(roleRights, roleRightPatches);

        return s3put(rightBucket, rightKey, roleRights);
    }

    async storeUserRight(user: string) {
        const rightKey = `user/${user}`;
        const userRights = (await this.loadRights<EntityRights>(rightKey)) || ({} as EntityRights);

        const userRightPatches = this.userRightPatches[user];
        if (!userRightPatches) {
            return;
        }

        applyRightsPatches(userRights, userRightPatches);

        return s3put(rightBucket, rightKey, userRights);
    }

    async storeNodeRight(nodeId: string) {
        const rightKey = `node/${nodeId}`;
        const nodeRights =
            (await this.loadRights<NodeEntityRights>(rightKey)) ||
            ({
                user: {},
                role: {},
            } as NodeEntityRights);

        const nodeRightPatches = this.nodeRightPatches[nodeId];
        if (!nodeRightPatches) {
            return;
        }

        applyRightsPatches(nodeRights.role, nodeRightPatches.role);
        applyRightsPatches(nodeRights.user, nodeRightPatches.user);

        return s3put(rightBucket, rightKey, nodeRights);
    }

    async storeAllRights() {
        // TODO: queue these operations to avoid throttling
        const rolePromises = Object.keys(this.roleRightPathes).map((roleId) => this.storeRoleRight(roleId));
        const userPromises = Object.keys(this.userRightPatches).map((user) => this.storeUserRight(user));
        const nodePromises = Object.keys(this.nodeRightPatches).map((nodeId) => this.storeNodeRight(nodeId));

        await Promise.all([...rolePromises, ...userPromises, ...nodePromises]);
    }
}

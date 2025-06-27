import { assocMap3, type Storage } from '@gothub/aws-util';
import type { EntityRights, NodeEntityRights } from './rights.types';

export class RightsLoader {
    entityRightsPromises: Map<PropertyKey, Promise<EntityRights>> = new Map();
    nodeRightsPromises: Map<PropertyKey, Promise<NodeEntityRights>> = new Map();

    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            RIGHTS: string;
        },
    ) {}

    loadEntityRights(key: string) {
        if (this.entityRightsPromises.has(key)) {
            return this.entityRightsPromises.get(key)!;
        }

        const promise = this.storage.get(this.locations.RIGHTS, key).then((json) => {
            if (!json) {
                return {} as EntityRights;
            }

            return JSON.parse(json) as EntityRights;
        });

        this.entityRightsPromises.set(key, promise);
        return promise;
    }

    loadNodeEntityRights(key: string) {
        if (this.nodeRightsPromises.has(key)) {
            return this.nodeRightsPromises.get(key)!;
        }

        const promise = this.storage.get(this.locations.RIGHTS, key).then((json) => {
            if (!json) {
                return {} as NodeEntityRights;
            }

            return JSON.parse(json) as NodeEntityRights;
        });

        this.nodeRightsPromises.set(key, promise);
        return promise;
    }

    loadUserRights(user: string) {
        const rightKey = `user/${user}`;
        return this.loadEntityRights(rightKey);
    }

    loadRoleRights(roleId: string) {
        const rightKey = `role/${roleId}`;
        return this.loadEntityRights(rightKey);
    }

    loadNodeRights(nodeId: string) {
        const rightKey = `node/${nodeId}`;
        return this.loadNodeEntityRights(rightKey);
    }

    loadPrincipalRights(principalType: string, principal: string): Promise<EntityRights> {
        if (principalType === 'user') {
            return this.loadUserRights(principal);
        } else if (principalType === 'role') {
            return this.loadRoleRights(principal);
        }
        throw new Error(`Unknown principal type: ${principalType}`);
    }

    async getRead(nodeId: string, principalType: string, principal: string) {
        const principalRights = await this.loadPrincipalRights(principalType, principal);
        const nodeRights = principalRights[nodeId];
        return nodeRights ? nodeRights.includes('r') : false;
    }

    async getWrite(nodeId: string, principalType: string, principal: string) {
        const principalRights = await this.loadPrincipalRights(principalType, principal);
        const nodeRights = principalRights[nodeId];
        return nodeRights ? nodeRights.includes('w') : false;
    }

    async getAdmin(nodeId: string, principalType: string, principal: string) {
        const principalRights = await this.loadPrincipalRights(principalType, principal);
        const nodeRights = principalRights[nodeId];
        return nodeRights ? nodeRights.includes('a') : false;
    }

    async listRights(nodeId: string): Promise<Map<string, unknown>> {
        const nodeRights = await this.loadNodeRights(nodeId);

        const res = new Map<string, unknown>();

        for (const [principalType, rights] of Object.entries(nodeRights)) {
            for (const [principal, rightsList] of Object.entries(rights)) {
                if (principalType !== 'user' && principalType !== 'role') {
                    continue; // Skip unsupported principal types
                }

                rightsList.includes('r') && assocMap3(principalType, principal, 'read', 'true', res);
                rightsList.includes('w') && assocMap3(principalType, principal, 'write', 'true', res);
                rightsList.includes('a') && assocMap3(principalType, principal, 'admin', 'true', res);
            }
        }

        return res;
    }
}

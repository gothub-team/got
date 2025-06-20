import type { Storage } from '@gothub/aws-util';
import type { EntityRights } from './rights.types';

export class RightsLoader {
    entityRightsPromises: Map<PropertyKey, Promise<EntityRights>> = new Map();

    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            RIGHTS: string;
        },
    ) {}

    async loadRights(key: string) {
        const json = await this.storage.get(this.locations.RIGHTS, key);
        if (!json) {
            return {} as EntityRights;
        }

        return JSON.parse(json) as EntityRights;
    }

    loadUserRights(user: string) {
        const rightKey = `user/${user}`;

        if (this.entityRightsPromises.has(rightKey)) {
            return this.entityRightsPromises.get(rightKey)!;
        }

        const promise = this.loadRights(rightKey);
        this.entityRightsPromises.set(rightKey, promise);
        return promise;
    }

    loadRoleRights(roleId: string) {
        const rightKey = `role/${roleId}`;
        if (this.entityRightsPromises.has(rightKey)) {
            return this.entityRightsPromises.get(rightKey)!;
        }

        const promise = this.loadRights(rightKey);
        this.entityRightsPromises.set(rightKey, promise);
        return promise;
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
}

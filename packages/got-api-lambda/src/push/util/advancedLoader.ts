import { s3get } from '@gothub/aws-util/s3';
import type { EntityRights } from './advanced.types';

const rightBucket = 'some-new-rights-bucket'; // TODO: Replace with actual bucket name

// TODO: implement interface for RightsLoder
export class AdvancedLoader {
    entityRightsPromises: Map<PropertyKey, Promise<EntityRights>> = new Map();

    async loadRights(key: string) {
        return s3get(rightBucket, key).then((buffer) => {
            if (!buffer) {
                return {} as EntityRights;
            }
            return JSON.parse(buffer.toString()) as EntityRights;
        });
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
        return nodeRights && nodeRights.includes('r');
    }

    async getWrite(nodeId: string, principalType: string, principal: string) {
        const principalRights = await this.loadPrincipalRights(principalType, principal);
        const nodeRights = principalRights[nodeId];
        return nodeRights && nodeRights.includes('w');
    }

    async getAdmin(nodeId: string, principalType: string, principal: string) {
        const principalRights = await this.loadPrincipalRights(principalType, principal);
        const nodeRights = principalRights[nodeId];
        return nodeRights && nodeRights.includes('a');
    }
}

import { loadQueue, type Storage } from '@gothub/aws-util';
import { RightsLoader } from './rights.loader';
import { RightsWriter } from './rights.writer';

export class RightsService {
    taskQueue = loadQueue(200);

    rightsLoader: RightsLoader;
    rightsWriter: RightsWriter;

    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            RIGHTS_READ: string;
            RIGHTS_WRITE: string;
            RIGHTS_ADMIN: string;
            OWNERS: string;
        },
    ) {
        this.rightsLoader = new RightsLoader(this.storage, { RIGHTS: 'RIGHTS_RWA' });
        this.rightsWriter = new RightsWriter(this.storage, { RIGHTS: 'RIGHTS_RWA' });
    }

    private async setRight(location: string, nodeId: string, principalType: string, principal: string, right: boolean) {
        const rightKey = `${nodeId}/${principalType}/${principal}`;
        if (!right) {
            return this.storage.delete(location, rightKey);
        } else {
            return this.storage.put(location, rightKey, 'true');
        }
    }

    async setRead(nodeId: string, principalType: 'user' | 'role', principal: string, right: boolean) {
        return this.rightsWriter.setRight('read', nodeId, principalType, principal, right);
    }
    async setWrite(nodeId: string, principalType: 'user' | 'role', principal: string, right: boolean) {
        return this.rightsWriter.setRight('write', nodeId, principalType, principal, right);
    }
    async setAdmin(nodeId: string, principalType: 'user' | 'role', principal: string, right: boolean) {
        return this.rightsWriter.setRight('admin', nodeId, principalType, principal, right);
    }

    async setOwner(nodeId: string, principal: string | null) {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }
        return this.storage.put(this.locations.OWNERS, `${nodeId}/owner/${principal}`, 'true');
    }

    async getRead(nodeId: string, principalType: 'user' | 'role', principal: string) {
        const patch = this.rightsWriter.getRightPatch('read', nodeId, principalType, principal);
        if (patch !== undefined) {
            return patch;
        }

        return this.rightsLoader.getRead(nodeId, principalType, principal);
    }
    async getWrite(nodeId: string, principalType: 'user' | 'role', principal: string) {
        const patch = this.rightsWriter.getRightPatch('read', nodeId, principalType, principal);
        if (patch !== undefined) {
            return patch;
        }

        return this.rightsLoader.getWrite(nodeId, principalType, principal);
    }
    async getAdmin(nodeId: string, principalType: 'user' | 'role', principal: string) {
        const patch = this.rightsWriter.getRightPatch('read', nodeId, principalType, principal);
        if (patch !== undefined) {
            return patch;
        }

        return this.rightsLoader.getAdmin(nodeId, principalType, principal);
    }

    async ownerExists(nodeId: string) {
        const owners = await this.taskQueue.queueLoad(() => this.storage.list(this.locations.OWNERS, `${nodeId}/`));
        return owners && owners.length > 0;
    }

    async listRights(nodeId: string): Promise<Map<string, unknown>> {
        return this.rightsLoader.listRights(nodeId);
    }

    async storeAllRights() {
        this.rightsWriter.storeAllRights();
    }
}

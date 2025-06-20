import { assocMap3, loadQueue, type Storage } from '@gothub/aws-util';

export class RightsService {
    taskQueue = loadQueue(200);

    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            RIGHTS_READ: string;
            RIGHTS_WRITE: string;
            RIGHTS_ADMIN: string;
            OWNERS: string;
        },
    ) {}

    private async setRight(location: string, nodeId: string, principalType: string, principal: string, right: boolean) {
        const rightKey = `${nodeId}/${principalType}/${principal}`;
        if (!right) {
            return this.storage.delete(location, rightKey);
        } else {
            return this.storage.put(location, rightKey, 'true');
        }
    }

    async setRead(nodeId: string, principalType: string, principal: string, right: boolean) {
        return this.setRight(this.locations.RIGHTS_READ, nodeId, principalType, principal, right);
    }
    async setWrite(nodeId: string, principalType: string, principal: string, right: boolean) {
        return this.setRight(this.locations.RIGHTS_WRITE, nodeId, principalType, principal, right);
    }
    async setAdmin(nodeId: string, principalType: string, principal: string, right: boolean) {
        return this.setRight(this.locations.RIGHTS_ADMIN, nodeId, principalType, principal, right);
    }

    async setOwner(nodeId: string, principal: string | null) {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }
        return this.storage.put(this.locations.OWNERS, `${nodeId}/owner/${principal}`, 'true');
    }

    async getRight(location: string, nodeId: string, principalType: string, principal: string) {
        const head = await this.taskQueue.queueLoad(() =>
            this.storage.exist(location, `${nodeId}/${principalType}/${principal}`),
        );
        return Boolean(head);
    }

    async getRead(nodeId: string, principalType: string, principal: string) {
        return this.getRight(this.locations.RIGHTS_READ, nodeId, principalType, principal);
    }
    async getWrite(nodeId: string, principalType: string, principal: string) {
        return this.getRight(this.locations.RIGHTS_WRITE, nodeId, principalType, principal);
    }
    async getAdmin(nodeId: string, principalType: string, principal: string) {
        return this.getRight(this.locations.RIGHTS_ADMIN, nodeId, principalType, principal);
    }

    async ownerExists(nodeId: string) {
        const owners = await this.taskQueue.queueLoad(() => this.storage.list(this.locations.OWNERS, `${nodeId}/`));
        return owners && owners.length > 0;
    }

    async listRights(nodeId: string) {
        const readRightsPromise = this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.RIGHTS_READ, `${nodeId}/`),
        );
        const writeRightsPromise = this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.RIGHTS_WRITE, `${nodeId}/`),
        );
        const adminRightsPromise = this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.RIGHTS_ADMIN, `${nodeId}/`),
        );

        const readRights = await readRightsPromise;
        const writeRights = await writeRightsPromise;
        const adminRights = await adminRightsPromise;

        const res = new Map<string, unknown>();
        for (let i = 0; i < readRights.length; i++) {
            const [, principalType, principal] = readRights[i].split('/');
            if (principalType === 'user' || principalType === 'role') {
                assocMap3(principalType, principal, 'read', 'true', res);
            }
        }
        for (let i = 0; i < writeRights.length; i++) {
            const [, principalType, principal] = writeRights[i].split('/');
            if (principalType === 'user' || principalType === 'role') {
                assocMap3(principalType, principal, 'write', 'true', res);
            }
        }
        for (let i = 0; i < adminRights.length; i++) {
            const [, principalType, principal] = adminRights[i].split('/');
            if (principalType === 'user' || principalType === 'role') {
                assocMap3(principalType, principal, 'admin', 'true', res);
            }
        }

        return res;
    }
}

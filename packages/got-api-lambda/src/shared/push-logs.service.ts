import type { Storage } from '@gothub/aws-util';

type Locations = {
    LOGS: string;
};

export class PushLogsService {
    constructor(
        private readonly storage: Storage,
        private readonly locations: Locations,
    ) {}

    async setPushLog(userEmail: string, requestId: string, changeset: string): Promise<void> {
        const timestamp = new Date().toISOString();
        const logEntry = `{"userEmail":"${userEmail}","timestamp":"${timestamp}","requestId":"${requestId}","changeset":${changeset}}`;
        const logKey = `push/${userEmail}/${timestamp}/${requestId}`;
        await this.storage.put(this.locations.LOGS, logKey, logEntry);
    }

    async getPushLog(userEmail: string, id: string): Promise<string | null | undefined> {
        return this.storage.get(this.locations.LOGS, `push/${userEmail}/${id}`);
    }

    async listPushLogs(userEmail: string, prefix: string): Promise<string[]> {
        const keys = await this.storage.list(this.locations.LOGS, `push/${userEmail}/${prefix}`);
        return keys.map((key) => key.replace(`push/${userEmail}/`, ''));
    }
}

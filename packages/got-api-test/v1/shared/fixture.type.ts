import type { GotApi } from '@gothub/got-api';

export interface TestFixture {
    testId: string;
    user1Api: GotApi;
    user1Email: string;
    user2Api: GotApi;
    user2Email: string;

    setup: () => Promise<void>;
    setTestId: () => void;
}

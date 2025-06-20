import { LocalTestFixture } from './fixture.local';
import { RemoteTestFixture } from './fixture.remote';

export const createFixture = () => {
    switch (process.env.TEST_MODE) {
        case 'local':
            return new LocalTestFixture();
        case 'remote':
        default:
            return new RemoteTestFixture();
    }
};

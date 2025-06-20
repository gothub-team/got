import type { Storage } from '@gothub/aws-util';

export class RightsService {
    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            MEDIA: string;
        },
    ) {}
}

import { CLOUDFRONT_ACCESS_KEY_ID, CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER } from './config.js';
import { ssmGetParameter } from './ssm.js';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

const createGetAccessKey = () => {
    let promise = null;

    return async () => {
        if (!promise) {
            promise = ssmGetParameter(CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER || 'CLOUDFRONT_ACCESS_KEY', true).catch(
                console.log,
            );
        }
        return promise;
    };
};

const getAccessKey = createGetAccessKey();

export const signUrl = async (url) => {
    const CLOUDFRONT_ACCESS_KEY = await getAccessKey();
    if (!!CLOUDFRONT_ACCESS_KEY_ID && !!CLOUDFRONT_ACCESS_KEY) {
        const expires = 1 * 24 * 60 * 60 * 1000;

        return getSignedUrl({
            url,
            keyPairId: CLOUDFRONT_ACCESS_KEY_ID,
            dateLessThan: new Date(Date.now() + expires),
            privateKey: CLOUDFRONT_ACCESS_KEY,
        });
    }
    throw new Error('Could not sign URL because of missing cloudfront keys.');
};

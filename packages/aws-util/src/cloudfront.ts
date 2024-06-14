import { CLOUDFRONT_ACCESS_KEY_ID, CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER } from './config';
import { ssmGetParameter } from './ssm';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

const createGetAccessKey = () => {
    let promise: Promise<string | void | undefined> | null = null;

    return async () => {
        if (!promise) {
            promise = ssmGetParameter(CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER || 'CLOUDFRONT_ACCESS_KEY', true).catch(
                console.error,
            );
        }
        return promise;
    };
};

const getAccessKey = createGetAccessKey();

const oneDay = 1 * 24 * 60 * 60 * 1000;
export const signUrl = async (url: string, expires: number = oneDay) => {
    const CLOUDFRONT_ACCESS_KEY = await getAccessKey();
    if (!!CLOUDFRONT_ACCESS_KEY_ID && !!CLOUDFRONT_ACCESS_KEY) {
        return getSignedUrl({
            url,
            keyPairId: CLOUDFRONT_ACCESS_KEY_ID,
            dateLessThan: new Date(Date.now() + expires).toDateString(),
            privateKey: CLOUDFRONT_ACCESS_KEY,
        });
    }
    throw new Error('Could not sign URL because of missing cloudfront keys.');
};

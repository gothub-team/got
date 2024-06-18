import { CLOUDFRONT_ACCESS_KEY_ID, MEDIA_DOMAIN, ssmGetParameter } from '@gothub/aws-util';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import type { Signer } from '../types/signer';

export const cfSigner = async (): Promise<Signer> => {
    const CLOUDFRONT_ACCESS_KEY = await ssmGetParameter('CLOUDFRONT_ACCESS_KEY', true);
    const oneDay = 1 * 24 * 60 * 60 * 1000;

    const getUrl = (fileKey: string, etag: string): string => `https://${MEDIA_DOMAIN}/${fileKey}?etag=${etag}`;

    // TODO: this is it's own function to allow async get of CLOUDFRONT_ACCESS_KEY on init
    const signUrl = (url: string, expires: number = oneDay): string =>
        getSignedUrl({
            url,
            keyPairId: CLOUDFRONT_ACCESS_KEY_ID || '',
            dateLessThan: new Date(Date.now() + expires).toISOString(),
            privateKey: CLOUDFRONT_ACCESS_KEY || '',
        });

    return { getUrl, signUrl };
};

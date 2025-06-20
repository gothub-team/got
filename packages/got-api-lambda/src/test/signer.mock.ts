/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Signer } from '../push/types/signer';

const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const mockSigner = async (): Promise<Signer> => {
    const getUrl = (fileKey: string, etag: string): string => `someurl.test`;

    const signUrl = (url: string, expires: number = oneDay): string => `some-signed-url`;

    return { getUrl, signUrl };
};

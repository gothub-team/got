import type { Signer } from '../push/types/signer';

export const mockSigner = async (): Promise<Signer> => {
    const getUrl = (fileKey: string, etag: string): string => `someurl.test`;

    const signUrl = (url: string, expires: number = oneDay): string => `some-signed-url`;

    return { getUrl, signUrl };
};

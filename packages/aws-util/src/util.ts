export const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': true,
};

export const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"A-Z]+(\.[^<>()[\]\\.,;:\s@"A-Z]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;

export const decodeBase64 = (base64: string) => Buffer.from(base64, 'base64').toString('utf-8');

export const decodeJwt = (jwt: string) => {
    const parts = jwt.split('.');
    return JSON.parse(decodeBase64(parts[1]));
};

export const jsonParseOr = <T>(or: T, str: string): T => {
    try {
        return JSON.parse(str);
    } catch {
        return or;
    }
};

export const substringToFirst = (str: string, char: string) => {
    const index = str.indexOf(char);
    if (index === -1) return str;
    return str.substring(0, index);
};

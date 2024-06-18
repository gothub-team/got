/**
 * Custom stringify function to convert map to JSON string
 * Supports only Objects, Maps and Strings, while Objects and Maps get stringified, strings are inserted into the JSON as is
 * @param input
 * @returns
 */
export const stringify = (input: Map<string, unknown> | Record<string, unknown> | string): string => {
    if (typeof input === 'string') return input;

    let str = '{';

    if ((input as Map<string, unknown>).keys != null) {
        const map = input as Map<string, unknown>;

        const keys = map.keys();
        const size = map.size;
        let counter = 0;

        for (const key of keys) {
            const value = map.get(key) as Map<string, unknown> | Record<string, unknown> | string;
            if (counter < size - 1) {
                str += `"${key}":${stringify(value)},`;
            } else {
                str += `"${key}":${stringify(value)}`;
            }

            counter += 1;
        }
    } else {
        const object = input as Record<string, unknown>;
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i < keys.length - 1) {
                str += `"${key}":${stringify(object[key] as Record<string, unknown> | string)},`;
            } else {
                str += `"${key}":${stringify(object[key] as Record<string, unknown> | string)}`;
            }
        }
    }

    str += '}';
    return str;
};

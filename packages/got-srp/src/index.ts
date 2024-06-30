import { Buffer } from 'buffer';
import { webcrypto as crypto } from 'crypto';

/**
 * An iterative implementation of the extended euclidean algorithm or extended greatest common divisor algorithm.
 * Take positive integers a, b as input, and return a triple (g, x, y), such that ax + by = g = gcd(a, b).
 *
 * @param a
 * @param b
 *
 * @throws {RangeError}
 * This excepction is thrown if a or b are less than 0
 *
 * @returns A triple (g, x, y), such that ax + by = g = gcd(a, b).
 */
export function eGcd(a, b) {
    if (typeof a === 'number') a = BigInt(a);
    if (typeof b === 'number') b = BigInt(b);

    if (a <= 0n || b <= 0n) throw new RangeError('a and b MUST be > 0'); // a and b MUST be positive

    let x = 0n;
    let y = 1n;
    let u = 1n;
    let v = 0n;

    while (a !== 0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        b = a;
        a = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }
    return {
        g: b,
        x,
        y,
    };
}

/**
 * Finds the smallest positive element that is congruent to a in modulo n
 *
 * @remarks
 * a and b must be the same type, either number or bigint
 *
 * @param a - An integer
 * @param n - The modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns A bigint with the smallest positive representation of a modulo n
 */
export function toZn(a, n) {
    if (typeof a === 'number') a = BigInt(a);
    if (typeof n === 'number') n = BigInt(n);

    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    }

    const aZn = a % n;
    return aZn < 0n ? aZn + n : aZn;
}

/**
 * Modular inverse.
 *
 * @param a The number to find an inverse for
 * @param n The modulo
 *
 * @throws {RangeError}
 * Excpeption thorwn when a does not have inverse modulo n
 *
 * @returns The inverse modulo n
 */
export function modInv(a, n) {
    const egcd = eGcd(toZn(a, n), n);
    if (egcd.g !== 1n) {
        throw new RangeError(`${a.toString()} does not have inverse modulo ${n.toString()}`); // modular inverse does not exist
    } else {
        return toZn(egcd.x, n);
    }
}

/**
 * Absolute value. abs(a)==a if a>=0. abs(a)==-a if a<0
 *
 * @param a
 *
 * @returns The absolute value of a
 */
export function abs(a) {
    return a >= 0 ? a : -a;
}

/**
 * Modular exponentiation b**e mod n. Currently using the right-to-left binary method
 *
 * @param b base
 * @param e exponent
 * @param n modulo
 *
 * @throws {RangeError}
 * Excpeption thrown when n is not > 0
 *
 * @returns b**e mod n
 */
export function modPow(b, e, n) {
    if (typeof b === 'number') b = BigInt(b);
    if (typeof e === 'number') e = BigInt(e);
    if (typeof n === 'number') n = BigInt(n);

    if (n <= 0n) {
        throw new RangeError('n must be > 0');
    } else if (n === 1n) {
        return 0n;
    }

    b = toZn(b, n);

    if (e < 0n) {
        return modInv(modPow(b, abs(e), n), n);
    }

    let r = 1n;
    while (e > 0) {
        if (e % 2n === 1n) {
            r = (r * b) % n;
        }
        e /= 2n;
        b = (b * b) % n;
    }
    return r;
}

/**
 * Returns a Buffer with a sequence of random nBytes
 *
 * @param {number} nBytes
 * @returns {Buffer} fixed-length sequence of random bytes
 */
function randomBytes(nBytes) {
    return bytesToHex(crypto.getRandomValues(new Uint8Array(nBytes)));
}

/**
 * Tests if a hex string has it most significant bit set (case-insensitive regex)
 */
const HEX_MSB_REGEX = /^[89a-f]/i;

const initN =
    'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1' +
    '29024E088A67CC74020BBEA63B139B22514A08798E3404DD' +
    'EF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245' +
    'E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' +
    'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3D' +
    'C2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F' +
    '83655D23DCA3AD961C62F356208552BB9ED529077096966D' +
    '670C354E4ABC9804F1746C08CA18217C32905E462E36CE3B' +
    'E39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9' +
    'DE2BCBF6955817183995497CEA956AE515D2261898FA0510' +
    '15728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64' +
    'ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7' +
    'ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6B' +
    'F12FFA06D98A0864D87602733EC86A64521F2B18177B200C' +
    'BBE117577A615D6C770988C0BAD946E208E24FA074E5AB31' +
    '43DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF';

export const useSrp = async () => {
    const N = BigInt(`0x${initN}`);
    const g = BigInt('0x2');
    const k = BigInt(`0x${await hexHash(`${padHex(N)}${padHex(g)}`)}`, 16);
    const smallAValue = generateRandomSmallA();
    const largeAValue = await calculateA({ smallAValue, g, N });
    const infoBits = bufferFrom('Caldera Derived Key', 'utf8');
    return {
        srpA: largeAValue.toString(16),
        getSignature: calculateSignature({
            N,
            g,
            k,
            smallAValue,
            largeAValue,
            infoBits,
        }),
    };
};

/**
 * Calculates the signature
 */
const calculateSignature =
    ({
        /** @property {BigInt} N Global N constant. */
        N,
        /** @property {BigInt} g Global g constant. */
        g,
        /** @property {BigInt} k Global k constant. */
        k,
        /** @property {Buffer} infoBits Info bits value. */
        infoBits,
        /** @property {BigInt} smallAValue Randomly generated small A. */
        smallAValue,
        /** @property {BigInt} largeAValue Large A value based on smallAValue. */
        largeAValue,
    }) =>
    async ({
        /** @property {String} poolname Cognito User Pool Name. */
        poolname,
        /** @property {String} userId Cognito User ID. */
        userId,
        /** @property {String} password Password. */
        password,
        /** @property {String} srpB Server B value. */
        srpB,
        /** @property {String} secretBlock Server secret block. */
        secretBlock,
        /** @property {String} salt Salt value. */
        salt,
    }) => {
        const serverBValue = BigInt(`0x${srpB}`);
        const _salt = BigInt(`0x${salt}`);

        if (serverBValue % N === 0n) {
            throw new Error('B cannot be zero.');
        }

        const UValue = await calculateU(largeAValue, serverBValue);

        if (UValue === 0n) {
            throw new Error('U cannot be zero.');
        }

        const usernamePassword = `${poolname}${userId}:${password}`;
        const usernamePasswordHash = await hash(usernamePassword);

        const xValue = BigInt(`0x${await hexHash(padHex(_salt) + usernamePasswordHash)}`, 16);
        const sValue = await calculateS({
            N,
            g,
            k,
            smallAValue,
            UValue,
            xValue,
            serverBValue,
        });
        const hkdf = await computehkdf({
            ikm: bufferFrom(padHex(sValue), 'hex'),
            salt: bufferFrom(padHex(UValue), 'hex'),
            infoBits,
        });

        const timestamp = getTimestamp();
        const message = bufferConcat([
            bufferFrom(poolname, 'utf8'),
            bufferFrom(userId, 'utf8'),
            bufferFrom(secretBlock, 'base64'),
            bufferFrom(timestamp, 'utf8'),
        ]);

        return {
            timestamp,
            signature: await hmacSha256(message, hkdf),
        };
    };

/**
 * Generate salts and compute verifier.
 * @param {Object} input input object.
 * @returns {string} verifierDevices
 */
// eslint-disable-next-line no-unused-vars
const generateHashDevice = ({
    /** @property {BigInt} N Global N constant. */
    N,
    /** @property {BigInt} g Global g constant. */
    g,
    /** @property {string} deviceGroupKey Devices to generate verifier for. */
    deviceGroupKey,
    /** @property {string} username User to generate verifier for. */
    username,
}) =>
    new Promise(async (resolve, reject) => {
        const randomPassword = generateRandomString();
        const combinedString = `${deviceGroupKey}${username}:${randomPassword}`;
        const hashedString = await hash(combinedString);

        const hexRandom = randomBytes(16).toString('hex');

        // The random hex will be unambiguously represented as a postive integer
        const saltToHashDevices = padHex(BigInt(`0x${hexRandom}`));

        g.modPow(BigInt(`0x${await hexHash(saltToHashDevices + hashedString)}`), N, (err, verifierDevicesNotPadded) => {
            if (err) {
                reject(err);
            }

            const verifierDevices = padHex(verifierDevicesNotPadded);
            resolve(verifierDevices);
        });
    });

/**
 * Standard hkdf algorithm
 * @returns {Buffer} Strong key material.
 * @private
 */
const computehkdf = async ({
    /** @property {Buffer} ikm Input key material. */
    ikm,
    /** @property {Buffer} salt Salt value. */
    salt,
    /** @property {Buffer} infoBits Info bits value. */
    infoBits,
}) => {
    // First set up our initial key
    const key = await crypto.subtle.importKey('raw', ikm, { name: 'HKDF' }, false, ['deriveKey', 'deriveBits']);

    // Then, perform the HKDF Extract and Expand
    const out = await crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            info: infoBits,
            salt,
            hash: 'SHA-256',
        },
        key,
        { name: 'HMAC', hash: 'SHA-256', length: 128 },
        false,
        ['sign'],
    );
    return out;
};

/**
 * Calculate the client's public value A = g^a%N
 * with the generated random number a
 * @param {Object} input input object.
 * @returns {BigInt} Large A value
 */
const calculateA = async ({
    /** @property {BigInt} N Global N constant. */
    N,
    /** @property {BigInt} g Global g constant. */
    g,
    /** @property {BigInt} smallAValue Randomly generated small A. */
    smallAValue,
}) =>
    new Promise((resolve, reject) => {
        const A = modPow(g, smallAValue, N);
        if (A % N === 0n) {
            reject(new Error('Illegal paramater. A mod N cannot be 0.'), null);
        }
        resolve(A);
    });

/**
 * helper function to generate a random big integer
 * @returns {BigInt} a random value.
 * @private
 */
const generateRandomSmallA = () => {
    // This will be interpreted as a postive 128-bit integer
    const hexRandom = randomBytes(128).toString('hex');

    const randomBigInt = BigInt(`0x${hexRandom}`);

    // There is no need to do randomBigInt.mod(this.N - 1) as N (3072-bit) is > 128 bytes (1024-bit)

    return randomBigInt;
};

/**
 * Calculates the S value used in getPasswordAuthenticationKey
 * @returns {void}
 */
const calculateS = ({
    /** @property {BigInt} N Global N constant. */
    N,
    /** @property {BigInt} g Global g constant. */
    g,
    /** @property {BigInt} k Global k constant. */
    k,
    /** @property {BigInt} smallAValue Randomly generated small A. */
    smallAValue,
    /** @property {BigInt} xValue Salted password hash value. */
    xValue,
    /** @property {BigInt} serverBValue Server B value. */
    serverBValue,
    /** @property {BigInt} serverBValue Server B value. */
    UValue,
}) =>
    new Promise((resolve) => {
        const gModPowXN = modPow(g, xValue, N);
        const intValue2 = serverBValue - k * gModPowXN;
        const intValue3 = smallAValue + UValue * xValue;
        const result = modPow(intValue2, intValue3, N);
        resolve(result % N);
    });

/**
 * Calculate the client's value U which is the hash of A and B
 * @param {BigInt} A Large A value.
 * @param {BigInt} B Server B value.
 * @returns {BigInt} Computed U value.
 * @private
 */
const calculateU = async (A, B) => {
    const UHexHash = await hexHash(padHex(A) + padHex(B));
    const finalU = BigInt(`0x${UHexHash}`);

    return finalU;
};

/**
 * helper function to generate a random string
 * @returns {string} a random value.
 * @private
 */
const generateRandomString = () => randomBytes(40).toString('base64');

/**
 * Returns an unambiguous, even-length hex string of the two's complement encoding of an integer.
 *
 * It is compatible with the hex encoding of Java's BigInt's toByteArray(), wich returns a
 * byte array containing the two's-complement representation of a BigInt. The array contains
 * the minimum number of bytes required to represent the BigInt, including at least one sign bit.
 *
 * Examples showing how ambiguity is avoided by left padding with:
 * "00" (for positive values where the most-significant-bit is set)
 *  "FF" (for negative values where the most-significant-bit is set)
 *
 * padHex(bigInt.fromInt(-236))  === "FF14"
 * padHex(bigInt.fromInt(20))    === "14"
 *
 * padHex(bigInt.fromInt(-200))  === "FF38"
 * padHex(bigInt.fromInt(56))    === "38"
 *
 * padHex(bigInt.fromInt(-20))   === "EC"
 * padHex(bigInt.fromInt(236))   === "00EC"
 *
 * padHex(bigInt.fromInt(-56))   === "C8"
 * padHex(bigInt.fromInt(200))   === "00C8"
 *
 * @param {BigInt} bigInt Number to encode.
 * @returns {String} even-length hex string of the two's complement encoding.
 */
const padHex = (bigInt) => {
    if (typeof bigInt !== 'bigint') {
        throw new Error('Not a BigInt');
    }

    const isNegative = bigInt < 0n;

    // Get a hex string for abs(bigInt)
    let hexStr = BigMath.abs(bigInt).toString(16);

    // Pad hex to even length if needed
    hexStr = hexStr.length % 2 !== 0 ? `0${hexStr}` : hexStr;

    // Prepend "00" if the most significant bit is set
    hexStr = HEX_MSB_REGEX.test(hexStr) ? `00${hexStr}` : hexStr;

    if (isNegative) {
        // Flip the bits of the representation
        const invertedNibbles = hexStr
            .split('')
            .map((x) => {
                // eslint-disable-next-line no-bitwise
                const invertedNibble = ~parseInt(x, 16) & 0xf;
                return '0123456789ABCDEF'.charAt(invertedNibble);
            })
            .join('');

        // After flipping the bits, add one to get the 2's complement representation
        const flippedBitsBI = BigInt(`0x${invertedNibbles}`) + 1n;

        hexStr = flippedBitsBI.toString(16);

        // For hex strings starting with 'FF8', 'FF' can be dropped, e.g. 0xFFFF80=0xFF80=0x80=-128

        // Any sequence of '1' bits on the left can always be substituted with a single '1' bit
        // without changing the represented value.

        // This only happens in the case when the input is 80...00

        if (hexStr.toUpperCase().startsWith('FF8')) {
            hexStr = hexStr.substring(2);
        }
    }

    return hexStr;
};

const BigMath = {
    abs: (x) => (x < 0n ? -x : x),
};

const hmacSha256 = async (buf, key) => {
    const message =
        buf instanceof Uint8Array || (typeof Buffer !== 'undefined' && buf instanceof Buffer)
            ? buf
            : new TextEncoder().encode(buf);
    const sig = await crypto.subtle.sign('HMAC', key, message);
    return bytesToBase64(new Uint8Array(sig));
};

/**
 * Calculate a hash from a bitArray
 * @param {Buffer} buf Value to hash.
 * @returns {String} Hex-encoded hash.
 * @private
 */
const hash = async (buf) => {
    const message =
        buf instanceof Uint8Array || (typeof Buffer !== 'undefined' && buf instanceof Buffer)
            ? buf
            : new TextEncoder().encode(buf);
    const result = await crypto.subtle.digest('SHA-256', message);
    return bytesToHex(new Uint8Array(result));
};

/**
 * Calculate a hash from a hex string
 * @param {String} hexStr Value to hash.
 * @returns {String} Hex-encoded hash.
 * @private
 */
const hexHash = async (hexStr) => hash(bufferFrom(hexStr, 'hex'));

// Fast Uint8Array to hex
const HEX_STRINGS = '0123456789abcdef';
const bytesToHex = (bytes) =>
    Array.from(bytes || [])
        // eslint-disable-next-line no-bitwise
        .map((b) => HEX_STRINGS[b >> 4] + HEX_STRINGS[b & 15])
        .join('');

const base64abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const bytesToBase64 = (bytes) => {
    let result = '';
    let i;
    const l = bytes.length;
    for (i = 2; i < l; i += 3) {
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
        result += base64abc[bytes[i] & 0x3f];
    }
    if (i === l + 1) {
        // 1 octet yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[(bytes[i - 2] & 0x03) << 4];
        result += '==';
    }
    if (i === l) {
        // 2 octets yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[(bytes[i - 1] & 0x0f) << 2];
        result += '=';
    }
    return result;
};

const bufferFrom = (input, encoding) => Buffer.from(input, encoding);
const bufferConcat = (arrays) => {
    const flatNumberArray = arrays.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
    }, []);

    return new Uint8Array(flatNumberArray);
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/**
 * Returns current date timestamp in format `ddd MMM D HH:mm:ss UTC YYYY`
 * @returns {string} Timestamp in format `ddd MMM D HH:mm:ss UTC YYYY`
 */
const getTimestamp = () => {
    const now = new Date();

    const weekDay = weekNames[now.getUTCDay()];
    const month = monthNames[now.getUTCMonth()];
    const day = now.getUTCDate();

    let hours = now.getUTCHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }

    let minutes = now.getUTCMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    let seconds = now.getUTCSeconds();
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    const year = now.getUTCFullYear();

    // ddd MMM D HH:mm:ss UTC YYYY
    const dateNow = `${weekDay} ${month} ${day} ${hours}:${minutes}:${seconds} UTC ${year}`;

    return dateNow;
};

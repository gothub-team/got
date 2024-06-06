import type { Session } from '@gothub/got-api';
import { useRef } from 'react';
import equals from 'fast-deep-equal';

export const getLocalStorageSessionStore = (sessionKey: string) => ({
    getSession: () => {
        try {
            const jsonStr = window.localStorage.getItem(sessionKey);
            if (!jsonStr) {
                return undefined;
            }

            return JSON.parse(jsonStr) as Session;
        } catch (error) {
            console.error('Invalid Session');
            return undefined;
        }
    },
    setSession: (session: Session) => {
        session && window.localStorage.setItem(sessionKey, JSON.stringify(session));
    },
    removeSession: () => {
        window.localStorage.removeItem(sessionKey);
    },
});

/** React hook to safeguard inputs from triggering effects or memos by checking for deep equality */
export const useEqualRef = <T>(input: T): T => {
    const ref = useRef<T>();
    const isEqual = equals(input, ref.current);
    if (!isEqual) {
        ref.current = input;
        return input;
    } else {
        return ref.current !== undefined ? ref.current : input;
    }
};

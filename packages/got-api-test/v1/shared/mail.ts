import { ImapFlow, type FetchMessageObject, type MailboxLockObject } from 'imapflow';

export type MailClientProps = {
    host: string;
    port: number;
    user: string;
    pass: string;
    mailbox: string;
    secure?: boolean;
};

export const createMailClient = ({ host, port, user, pass, mailbox, secure = true }: MailClientProps) => {
    let client: ImapFlow | undefined;
    let lock: MailboxLockObject | undefined;

    let subscribers: Record<string, ((message: FetchMessageObject) => void) | undefined> = {};

    const init = async () => {
        // const pass = await ssmGetParameter('API_TEST_EMAIL_PASSWORD', true);
        client = new ImapFlow({
            host,
            port,
            secure,
            logger: {
                debug: () => {},
                info: () => {},
                warn: () => {},
                error: () => {},
            },
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user,
                pass,
            },
        });
        // Wait until client connects and authorizes
        await client.connect();

        // Select and lock a mailbox. Throws if mailbox does not exist
        lock = await client.getMailboxLock(mailbox);

        client.on('exists', handleEmailCountChange);
    };

    const handleEmailCountChange = async ({ prevCount }: { prevCount: number }) => {
        console.log('exists', performance.now());
        const messages = await client?.fetch(`${prevCount + 1}:*`, {
            envelope: true,
            bodyParts: ['1'],
        });
        if (!messages) return;
        for await (const message of messages) {
            const to = message.envelope.to[0]?.address;
            if (to && subscribers[to]) {
                subscribers[to]?.(message);
                unsubscribeTo(to);
            }
        }
    };

    const close = async () => {
        subscribers = {};
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock?.release();
        lock = undefined;

        await client?.logout();
        client = undefined;
    };

    const subscribeTo = (email: string, fnSub: (message: FetchMessageObject) => void) => {
        subscribers[email] = fnSub;
    };

    const unsubscribeTo = (email: string) => {
        subscribers[email] = undefined;
    };

    const receiveMailTo = async (toEmail: string): Promise<string> =>
        new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject('no mails received');
            }, 60000);
            subscribeTo(toEmail, (message: FetchMessageObject) => {
                resolve(message.bodyParts.get('1')?.toString() || '');
                clearTimeout(timeout);
            });
        });

    return {
        init,
        close,
        receiveMailTo,
    };
};

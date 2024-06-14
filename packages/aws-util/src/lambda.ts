import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { AWS_REGION } from './config.js';

const client = new LambdaClient({
    region: AWS_REGION,
    apiVersion: 'latest',
});

const Decoder = new TextDecoder();

export const invokeLambda = async <TBody, TRes>(functionName: string, body: TBody) => {
    const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify({ body }),
        InvocationType: 'RequestResponse',
    });
    try {
        const results = await client.send(command);
        if (results.FunctionError) {
            return Promise.reject(JSON.parse(Decoder.decode(results.Payload)));
        }

        return JSON.parse(Decoder.decode(results.Payload)) as TRes;
    } catch (err) {
        // TODO: why not pass the error up?
        console.error(err);
        return undefined;
    }
};

export const invokeLambdaEvent = async <TBody>(functionName: string, body: TBody) => {
    const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify({ body }),
        InvocationType: 'Event',
    });
    try {
        await client.send(command);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

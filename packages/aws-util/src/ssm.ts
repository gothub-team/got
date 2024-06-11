import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { AWS_REGION } from './config';

const client = new SSMClient({
    region: AWS_REGION,
    apiVersion: 'latest',
});

export const ssmGetParameter = async (name: string, encrypted = false) => {
    const command = new GetParameterCommand({
        Name: name,
        WithDecryption: encrypted,
    });
    try {
        const results = await client.send(command);
        return results.Parameter ? results.Parameter.Value : undefined;
    } catch (err) {
        console.log(err);
        return undefined;
    }
};

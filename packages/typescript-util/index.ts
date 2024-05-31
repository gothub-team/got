import { z } from 'zod';

export const parseEnv = (schemaObject: Record<string, z.Schema>): Record<string, string> => {
    const schema = z.object(schemaObject);
    try {
        const result = schema.parse(process.env);
        return result;
    } catch (error) {
        const redBold = '\x1b[1;31m';
        const italicGrey = '\x1b[3;90m';
        const resetB = '\x1b[0m';
        const resetI = '\x1b[0m';
        let result = '\nInvalid environment variables:\n';
        (error as z.ZodError).errors.forEach((e) => {
            result += `${redBold}${e.path.join('.')}:${resetB} ${e.message} ${italicGrey}${schemaObject[e.path[0]]._def.description}${resetI} \n`;
        });
        throw result;
    }
};

export const awsRegions = [
    'af-south-1',
    'ap-east-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ap-south-1',
    'ap-south-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'ca-central-1',
    'ca-west-1',
    'cn-north-1',
    'cn-northwest-1',
    'eu-central-1',
    'eu-central-2',
    'eu-north-1',
    'eu-south-1',
    'eu-south-2',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'me-central-1',
    'me-south-1',
    'sa-east-1',
    'us-gov-east-1',
    'us-gov-west-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
] as const;

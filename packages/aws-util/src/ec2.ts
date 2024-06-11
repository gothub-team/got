import { DescribeInstancesCommand, EC2Client, type Instance } from '@aws-sdk/client-ec2';
import { AWS_REGION } from './config.js';

const client = new EC2Client({
    region: AWS_REGION,
    apiVersion: 'latest',
});

export const ec2DescribeInstances = async (instanceIds: string[]): Promise<Instance[]> => {
    const command = new DescribeInstancesCommand({
        InstanceIds: instanceIds,
    });

    try {
        const { Reservations = [] } = await client.send(command);

        const instances = [];

        for (const reservation of Reservations) {
            if (reservation.Instances) {
                for (const instance of reservation.Instances) {
                    instances.push(instance);
                }
            }
        }

        return instances;
    } catch (err) {
        console.log(err);
        return [];
    }
};

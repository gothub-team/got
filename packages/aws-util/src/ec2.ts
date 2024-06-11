import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import * as R from 'ramda';
import { AWS_REGION } from './config.js';

const client = new EC2Client({
    region: AWS_REGION,
    signatureVersion: 'v4',
    apiVersion: 'latest',
});

export const ec2DescribeInstances = async (instanceIds) => {
    const command = new DescribeInstancesCommand({
        InstanceIds: instanceIds,
    });

    try {
        const { Reservations = [] } = await client.send(command);
        return R.compose(R.flatten, R.map(R.path(['Instances'])))(Reservations);
    } catch (err) {
        console.log(err);
        return [];
    }
};

import {
    DescribeContainerInstancesCommand,
    DescribeTasksCommand,
    ECSClient,
    ListTasksCommand,
} from '@aws-sdk/client-ecs';
import { AWS_REGION } from './config.js';

const client = new ECSClient({
    region: AWS_REGION,
    apiVersion: 'latest',
});

export const ecsListTasks = async (clusterName: string, serviceName: string) => {
    const command = new ListTasksCommand({
        cluster: clusterName,
        serviceName,
        desiredStatus: 'RUNNING',
    });

    try {
        const { taskArns = [] } = await client.send(command);
        return taskArns;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const ecsDescribeTasks = async (clusterName: string, taskArns: string[]) => {
    const command = new DescribeTasksCommand({
        cluster: clusterName,
        tasks: taskArns,
    });

    try {
        const { tasks = [] } = await client.send(command);
        return tasks;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const ecsDescribeContainerInstances = async (clusterName: string, instanceArns: string[]) => {
    const command = new DescribeContainerInstancesCommand({
        cluster: clusterName,
        containerInstances: instanceArns,
    });

    try {
        const { containerInstances = [] } = await client.send(command);
        return containerInstances;
    } catch (err) {
        console.log(err);
        return [];
    }
};

import * as pulumi from '@pulumi/pulumi';
export declare class GraphStore extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of GraphStore.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is GraphStore;
    /**
     * The Name of the bucket for edge storage.
     */
    readonly bucketEdgesName: pulumi.Output<string>;
    /**
     * The Name of the bucket for file storage.
     */
    readonly bucketLogsName: pulumi.Output<string | undefined>;
    /**
     * The Name of the bucket for file storage.
     */
    readonly bucketMediaName: pulumi.Output<string | undefined>;
    /**
     * The Name of the bucket for node storage.
     */
    readonly bucketNodesName: pulumi.Output<string>;
    /**
     * The Name of the bucket for reverse edge storage.
     */
    readonly bucketReverseEdgesName: pulumi.Output<string>;
    /**
     * The Name of the bucket for admin right storage.
     */
    readonly bucketRightsAdminName: pulumi.Output<string>;
    /**
     * The Name of the bucket for owner right storage.
     */
    readonly bucketRightsOwnerName: pulumi.Output<string>;
    /**
     * The Name of the bucket for read right storage.
     */
    readonly bucketRightsReadName: pulumi.Output<string>;
    /**
     * The Name of the bucket for write right storage.
     */
    readonly bucketRightsWriteName: pulumi.Output<string>;
    /**
     * The ARN of the logs bucket read policy.
     */
    readonly logsBucketReadPolicyArn: pulumi.Output<string>;
    /**
     * The ARN of the logs bucket write policy.
     */
    readonly logsBucketWritePolicyArn: pulumi.Output<string>;
    /**
     * The ARN of the media bucket read policy.
     */
    readonly mediaBucketReadPolicyArn: pulumi.Output<string>;
    /**
     * The ARN of the media bucket write policy.
     */
    readonly mediaBucketWritePolicyArn: pulumi.Output<string>;
    /**
     * The ARN of the storage read policy.
     */
    readonly storageReadPolicyArn: pulumi.Output<string>;
    /**
     * The ARN of the storage write policy.
     */
    readonly storageWritePolicyArn: pulumi.Output<string>;
    /**
     * Create a GraphStore resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: GraphStoreArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a GraphStore resource.
 */
export interface GraphStoreArgs {
    /**
     * The bucket to be used for edge storage
     */
    bucketEdgesName?: pulumi.Input<string>;
    /**
     * The bucket to be used for log storage
     */
    bucketLogsName?: pulumi.Input<string>;
    /**
     * The bucket to be used for file storage
     */
    bucketMediaName?: pulumi.Input<string>;
    /**
     * The bucket to be used for node storage
     */
    bucketNodesName?: pulumi.Input<string>;
    /**
     * The bucket to be used for reverse edge storage
     */
    bucketReverseEdgesName?: pulumi.Input<string>;
    /**
     * The bucket to be used for admin right storage
     */
    bucketRightsAdminName?: pulumi.Input<string>;
    /**
     * The bucket to be used for owner right storage
     */
    bucketRightsOwnerName?: pulumi.Input<string>;
    /**
     * The bucket to be used for read right storage
     */
    bucketRightsReadName?: pulumi.Input<string>;
    /**
     * The bucket to be used for write right storage
     */
    bucketRightsWriteName?: pulumi.Input<string>;
    /**
     * If the buckets should be destroyed on stack removal even if they are not empty.
     */
    forceDestroy?: pulumi.Input<boolean>;
}

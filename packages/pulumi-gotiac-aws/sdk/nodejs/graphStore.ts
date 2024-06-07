// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

export class GraphStore extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'gotiac:index:GraphStore';

    /**
     * Returns true if the given object is an instance of GraphStore.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is GraphStore {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === GraphStore.__pulumiType;
    }

    /**
     * The Name of the bucket for edge storage.
     */
    public readonly bucketEdgesName!: pulumi.Output<string>;
    /**
     * The Name of the bucket for node storage.
     */
    public readonly bucketNodesName!: pulumi.Output<string>;
    /**
     * The Name of the bucket for reverse edge storage.
     */
    public readonly bucketReverseEdgesName!: pulumi.Output<string>;
    /**
     * The Name of the bucket for admin right storage.
     */
    public readonly bucketRightsAdminName!: pulumi.Output<string>;
    /**
     * The Name of the bucket for owner right storage.
     */
    public readonly bucketRightsOwnerName!: pulumi.Output<string>;
    /**
     * The Name of the bucket for read right storage.
     */
    public readonly bucketRightsReadName!: pulumi.Output<string>;
    /**
     * The Name of the bucket for write right storage.
     */
    public readonly bucketRightsWriteName!: pulumi.Output<string>;
    /**
     * The ARN of the storage read policy.
     */
    public /*out*/ readonly storageReadPolicyArn!: pulumi.Output<string>;
    /**
     * The ARN of the storage write policy.
     */
    public /*out*/ readonly storageWritePolicyArn!: pulumi.Output<string>;

    /**
     * Create a GraphStore resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: GraphStoreArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs["bucketEdgesName"] = args ? args.bucketEdgesName : undefined;
            resourceInputs["bucketNodesName"] = args ? args.bucketNodesName : undefined;
            resourceInputs["bucketReverseEdgesName"] = args ? args.bucketReverseEdgesName : undefined;
            resourceInputs["bucketRightsAdminName"] = args ? args.bucketRightsAdminName : undefined;
            resourceInputs["bucketRightsOwnerName"] = args ? args.bucketRightsOwnerName : undefined;
            resourceInputs["bucketRightsReadName"] = args ? args.bucketRightsReadName : undefined;
            resourceInputs["bucketRightsWriteName"] = args ? args.bucketRightsWriteName : undefined;
            resourceInputs["storageReadPolicyArn"] = undefined /*out*/;
            resourceInputs["storageWritePolicyArn"] = undefined /*out*/;
        } else {
            resourceInputs["bucketEdgesName"] = undefined /*out*/;
            resourceInputs["bucketNodesName"] = undefined /*out*/;
            resourceInputs["bucketReverseEdgesName"] = undefined /*out*/;
            resourceInputs["bucketRightsAdminName"] = undefined /*out*/;
            resourceInputs["bucketRightsOwnerName"] = undefined /*out*/;
            resourceInputs["bucketRightsReadName"] = undefined /*out*/;
            resourceInputs["bucketRightsWriteName"] = undefined /*out*/;
            resourceInputs["storageReadPolicyArn"] = undefined /*out*/;
            resourceInputs["storageWritePolicyArn"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(GraphStore.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
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
}

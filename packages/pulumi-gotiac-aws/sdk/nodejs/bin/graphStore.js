'use strict';
// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, '__esModule', { value: true });
exports.GraphStore = void 0;
const pulumi = require('@pulumi/pulumi');
const utilities = require('./utilities');
class GraphStore extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of GraphStore.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj) {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === GraphStore.__pulumiType;
    }
    /**
     * Create a GraphStore resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name, args, opts) {
        let resourceInputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs['bucketEdgesName'] = args ? args.bucketEdgesName : undefined;
            resourceInputs['bucketLogsName'] = args ? args.bucketLogsName : undefined;
            resourceInputs['bucketMediaName'] = args ? args.bucketMediaName : undefined;
            resourceInputs['bucketNodesName'] = args ? args.bucketNodesName : undefined;
            resourceInputs['bucketReverseEdgesName'] = args ? args.bucketReverseEdgesName : undefined;
            resourceInputs['bucketRightsAdminName'] = args ? args.bucketRightsAdminName : undefined;
            resourceInputs['bucketRightsOwnerName'] = args ? args.bucketRightsOwnerName : undefined;
            resourceInputs['bucketRightsReadName'] = args ? args.bucketRightsReadName : undefined;
            resourceInputs['bucketRightsWriteName'] = args ? args.bucketRightsWriteName : undefined;
            resourceInputs['forceDestroy'] = args ? args.forceDestroy : undefined;
            resourceInputs['logsBucketReadPolicyArn'] = undefined /*out*/;
            resourceInputs['logsBucketWritePolicyArn'] = undefined /*out*/;
            resourceInputs['mediaBucketReadPolicyArn'] = undefined /*out*/;
            resourceInputs['mediaBucketWritePolicyArn'] = undefined /*out*/;
            resourceInputs['storageReadPolicyArn'] = undefined /*out*/;
            resourceInputs['storageWritePolicyArn'] = undefined /*out*/;
        } else {
            resourceInputs['bucketEdgesName'] = undefined /*out*/;
            resourceInputs['bucketLogsName'] = undefined /*out*/;
            resourceInputs['bucketMediaName'] = undefined /*out*/;
            resourceInputs['bucketNodesName'] = undefined /*out*/;
            resourceInputs['bucketReverseEdgesName'] = undefined /*out*/;
            resourceInputs['bucketRightsAdminName'] = undefined /*out*/;
            resourceInputs['bucketRightsOwnerName'] = undefined /*out*/;
            resourceInputs['bucketRightsReadName'] = undefined /*out*/;
            resourceInputs['bucketRightsWriteName'] = undefined /*out*/;
            resourceInputs['logsBucketReadPolicyArn'] = undefined /*out*/;
            resourceInputs['logsBucketWritePolicyArn'] = undefined /*out*/;
            resourceInputs['mediaBucketReadPolicyArn'] = undefined /*out*/;
            resourceInputs['mediaBucketWritePolicyArn'] = undefined /*out*/;
            resourceInputs['storageReadPolicyArn'] = undefined /*out*/;
            resourceInputs['storageWritePolicyArn'] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(GraphStore.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}
exports.GraphStore = GraphStore;
/** @internal */
GraphStore.__pulumiType = 'gotiac:index:GraphStore';
//# sourceMappingURL=graphStore.js.map

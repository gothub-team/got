// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from '@pulumi/pulumi';
import * as utilities from './utilities';

export class FileHosting extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'gotiac:index:FileHosting';

    /**
     * Returns true if the given object is an instance of FileHosting.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is FileHosting {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === FileHosting.__pulumiType;
    }

    /**
     * The ID the private key.
     */
    public readonly /*out*/ privateKeyId!: pulumi.Output<string>;
    /**
     * The parameter name for the private key.
     */
    public readonly /*out*/ privateKeyParameterName!: pulumi.Output<string>;
    /**
     * The file hosting URL.
     */
    public readonly /*out*/ url!: pulumi.Output<string>;

    /**
     * Create a FileHosting resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: FileHostingArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.domain === undefined) && !opts.urn) {
                throw new Error("Missing required property 'domain'");
            }
            resourceInputs['bucketName'] = args ? args.bucketName : undefined;
            resourceInputs['domain'] = args ? args.domain : undefined;
            resourceInputs['privateKeyId'] = undefined /*out*/;
            resourceInputs['privateKeyParameterName'] = undefined /*out*/;
            resourceInputs['url'] = undefined /*out*/;
        } else {
            resourceInputs['privateKeyId'] = undefined /*out*/;
            resourceInputs['privateKeyParameterName'] = undefined /*out*/;
            resourceInputs['url'] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(FileHosting.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a FileHosting resource.
 */
export interface FileHostingArgs {
    /**
     * The name of an existing s3 Bucket to link as origin. If not provided, a new bucket will be created.
     */
    bucketName?: pulumi.Input<string>;
    /**
     * The file hosting domain.
     */
    domain: pulumi.Input<string>;
}

import * as pulumi from '@pulumi/pulumi';
export declare class FileHosting extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of FileHosting.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is FileHosting;
    /**
     * The ID the private key.
     */
    readonly privateKeyId: pulumi.Output<string>;
    /**
     * The parameter name for the private key.
     */
    readonly privateKeyParameterName: pulumi.Output<string>;
    /**
     * The file hosting URL.
     */
    readonly url: pulumi.Output<string>;
    /**
     * Create a FileHosting resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: FileHostingArgs, opts?: pulumi.ComponentResourceOptions);
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

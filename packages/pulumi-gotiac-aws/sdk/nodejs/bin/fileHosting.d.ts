import * as pulumi from '@pulumi/pulumi';
/**
 * The FileHosting component creates an s3 bucket for file storage and a CDN distribution for file access.
 */
export declare class FileHosting extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of FileHosting.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is FileHosting;
    /**
     * The name of the created media bucket that is used to store files.
     */
    readonly bucketName: pulumi.Output<string>;
    /**
     * The file hosting domain.
     */
    readonly domain: pulumi.Output<string>;
    /**
     * The ID of the private key which is used to identify which key was used to sign a URL.
     */
    readonly privateKeyId: pulumi.Output<string>;
    /**
     * The ssm parameter name for the private key that is used to sign upload and download URLs.
     */
    readonly privateKeyParameterName: pulumi.Output<string>;
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
    /**
     * If the bucket should be destroyed on stack removal even if it is not empty.
     */
    forceDestroyBucket?: pulumi.Input<boolean>;
}

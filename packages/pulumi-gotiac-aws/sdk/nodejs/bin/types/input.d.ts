import * as pulumi from '@pulumi/pulumi';
export interface ApiFileHostingInputArgs {
    /**
     * The name of the created media bucket that is used to store files.
     */
    bucketName: pulumi.Input<string>;
    /**
     * The ID of the private key which is used to identify which key was used to sign a URL.
     */
    privateKeyId: pulumi.Input<string>;
    /**
     * The ssm parameter name for the private key that is used to sign upload and download URLs.
     */
    privateKeyParameterName: pulumi.Input<string>;
}

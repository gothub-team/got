import * as pulumi from '@pulumi/pulumi';
export declare class Api extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Api.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Api;
    readonly authInviteUserEndpoint: pulumi.Output<string>;
    readonly authLoginInitEndpoint: pulumi.Output<string>;
    readonly authLoginRefreshEndpoint: pulumi.Output<string>;
    readonly authLoginVerifyEndpoint: pulumi.Output<string>;
    readonly authRegisterInitEndpoint: pulumi.Output<string>;
    readonly authRegisterVerifyEndpoint: pulumi.Output<string>;
    readonly authRegisterVerifyResendEndpoint: pulumi.Output<string>;
    readonly authResetPasswordInitEndpoint: pulumi.Output<string>;
    readonly authResetPasswordVerifyEndpoint: pulumi.Output<string>;
    /**
     * The endpoint of the API.
     */
    readonly endpoint: pulumi.Output<string>;
    readonly openApiEndpoint: pulumi.Output<string>;
    readonly pullEndpoint: pulumi.Output<string>;
    readonly pullInvokePolicyArn: pulumi.Output<string>;
    readonly pushEndpoint: pulumi.Output<string>;
    readonly pushInvokePolicyArn: pulumi.Output<string>;
    /**
     * Create a Api resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ApiArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Api resource.
 */
export interface ApiArgs {
    /**
     * The Name of the existing bucket for edge storage.
     */
    bucketEdgesName?: pulumi.Input<string>;
    /**
     * The Name of the existing bucket for node storage.
     */
    bucketNodesName?: pulumi.Input<string>;
    /**
     * The Name of the existing bucket for reverse edge storage.
     */
    bucketReverseEdgesName?: pulumi.Input<string>;
    /**
     * The Name of the existing bucket for admin right storage.
     */
    bucketRightsAdminName?: pulumi.Input<string>;
    /**
     * The Name of the existing bucket for owner right storage.
     */
    bucketRightsOwnerName?: pulumi.Input<string>;
    /**
     * The Name of the existing bucket for read right storage.
     */
    bucketRightsReadName?: pulumi.Input<string>;
    /**
     * The Name of the existing bucket for write right storage.
     */
    bucketRightsWriteName?: pulumi.Input<string>;
    /**
     * The path to the directory containing the deployment packages.
     */
    codePath: pulumi.Input<string>;
    /**
     * Domain name of the got api.
     */
    domainName: pulumi.Input<string>;
    /**
     * If the store buckets should be destroyed on stack removal even if they are not empty.
     */
    forceStoreDestroy?: pulumi.Input<boolean>;
    /**
     * got view that covers nodes for a user needs read rights in order to invite other users.
     */
    inviteUserValidationView?: pulumi.Input<string>;
    /**
     * The runtime environment for the Lambda function.
     */
    runtime: pulumi.Input<string>;
    /**
     * ID of the user pool.
     */
    userPoolId: pulumi.Input<string>;
}

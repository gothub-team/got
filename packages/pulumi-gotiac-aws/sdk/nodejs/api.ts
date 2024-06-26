// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from '@pulumi/pulumi';
import * as inputs from './types/input';
import * as outputs from './types/output';
import * as utilities from './utilities';

export class Api extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'gotiac:index:Api';

    /**
     * Returns true if the given object is an instance of Api.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Api {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Api.__pulumiType;
    }

    public readonly /*out*/ authInviteUserEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authLoginInitEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authLoginRefreshEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authLoginVerifyEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authRegisterInitEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authRegisterVerifyEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authRegisterVerifyResendEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authResetPasswordInitEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ authResetPasswordVerifyEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ bucketMediaName!: pulumi.Output<string>;
    /**
     * The endpoint of the API.
     */
    public readonly /*out*/ endpoint!: pulumi.Output<string>;
    public readonly /*out*/ openApiEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ pullEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ pullInvokePolicyArn!: pulumi.Output<string>;
    public readonly /*out*/ pullLambdaName!: pulumi.Output<string>;
    public readonly /*out*/ pushEndpoint!: pulumi.Output<string>;
    public readonly /*out*/ pushInvokePolicyArn!: pulumi.Output<string>;

    /**
     * Create a Api resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ApiArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.domainName === undefined) && !opts.urn) {
                throw new Error("Missing required property 'domainName'");
            }
            if ((!args || args.runtime === undefined) && !opts.urn) {
                throw new Error("Missing required property 'runtime'");
            }
            if ((!args || args.userPoolId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'userPoolId'");
            }
            resourceInputs['bucketEdgesName'] = args ? args.bucketEdgesName : undefined;
            resourceInputs['bucketNodesName'] = args ? args.bucketNodesName : undefined;
            resourceInputs['bucketReverseEdgesName'] = args ? args.bucketReverseEdgesName : undefined;
            resourceInputs['bucketRightsAdminName'] = args ? args.bucketRightsAdminName : undefined;
            resourceInputs['bucketRightsOwnerName'] = args ? args.bucketRightsOwnerName : undefined;
            resourceInputs['bucketRightsReadName'] = args ? args.bucketRightsReadName : undefined;
            resourceInputs['bucketRightsWriteName'] = args ? args.bucketRightsWriteName : undefined;
            resourceInputs['codePath'] = args ? args.codePath : undefined;
            resourceInputs['domainName'] = args ? args.domainName : undefined;
            resourceInputs['fileHosting'] = args ? args.fileHosting : undefined;
            resourceInputs['forceStoreDestroy'] = args ? args.forceStoreDestroy : undefined;
            resourceInputs['inviteUserValidationView'] = args ? args.inviteUserValidationView : undefined;
            resourceInputs['runtime'] = args ? args.runtime : undefined;
            resourceInputs['userPoolId'] = args ? args.userPoolId : undefined;
            resourceInputs['authInviteUserEndpoint'] = undefined /*out*/;
            resourceInputs['authLoginInitEndpoint'] = undefined /*out*/;
            resourceInputs['authLoginRefreshEndpoint'] = undefined /*out*/;
            resourceInputs['authLoginVerifyEndpoint'] = undefined /*out*/;
            resourceInputs['authRegisterInitEndpoint'] = undefined /*out*/;
            resourceInputs['authRegisterVerifyEndpoint'] = undefined /*out*/;
            resourceInputs['authRegisterVerifyResendEndpoint'] = undefined /*out*/;
            resourceInputs['authResetPasswordInitEndpoint'] = undefined /*out*/;
            resourceInputs['authResetPasswordVerifyEndpoint'] = undefined /*out*/;
            resourceInputs['bucketMediaName'] = undefined /*out*/;
            resourceInputs['endpoint'] = undefined /*out*/;
            resourceInputs['openApiEndpoint'] = undefined /*out*/;
            resourceInputs['pullEndpoint'] = undefined /*out*/;
            resourceInputs['pullInvokePolicyArn'] = undefined /*out*/;
            resourceInputs['pullLambdaName'] = undefined /*out*/;
            resourceInputs['pushEndpoint'] = undefined /*out*/;
            resourceInputs['pushInvokePolicyArn'] = undefined /*out*/;
        } else {
            resourceInputs['authInviteUserEndpoint'] = undefined /*out*/;
            resourceInputs['authLoginInitEndpoint'] = undefined /*out*/;
            resourceInputs['authLoginRefreshEndpoint'] = undefined /*out*/;
            resourceInputs['authLoginVerifyEndpoint'] = undefined /*out*/;
            resourceInputs['authRegisterInitEndpoint'] = undefined /*out*/;
            resourceInputs['authRegisterVerifyEndpoint'] = undefined /*out*/;
            resourceInputs['authRegisterVerifyResendEndpoint'] = undefined /*out*/;
            resourceInputs['authResetPasswordInitEndpoint'] = undefined /*out*/;
            resourceInputs['authResetPasswordVerifyEndpoint'] = undefined /*out*/;
            resourceInputs['bucketMediaName'] = undefined /*out*/;
            resourceInputs['endpoint'] = undefined /*out*/;
            resourceInputs['openApiEndpoint'] = undefined /*out*/;
            resourceInputs['pullEndpoint'] = undefined /*out*/;
            resourceInputs['pullInvokePolicyArn'] = undefined /*out*/;
            resourceInputs['pullLambdaName'] = undefined /*out*/;
            resourceInputs['pushEndpoint'] = undefined /*out*/;
            resourceInputs['pushInvokePolicyArn'] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Api.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
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
    codePath?: pulumi.Input<string>;
    /**
     * Domain name of the got api.
     */
    domainName: pulumi.Input<string>;
    fileHosting?: pulumi.Input<inputs.ApiFileHostingInputArgs>;
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

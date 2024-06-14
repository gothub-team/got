// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from '@pulumi/pulumi';
import * as inputs from './types/input';
import * as outputs from './types/output';
import * as utilities from './utilities';

export class CustomMailer extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'gotiac:index:CustomMailer';

    /**
     * Returns true if the given object is an instance of CustomMailer.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is CustomMailer {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === CustomMailer.__pulumiType;
    }

    /**
     * Create a CustomMailer resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CustomMailerArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.codePath === undefined) && !opts.urn) {
                throw new Error("Missing required property 'codePath'");
            }
            if ((!args || args.invokePullPolicyArn === undefined) && !opts.urn) {
                throw new Error("Missing required property 'invokePullPolicyArn'");
            }
            if ((!args || args.notificationsEmailAccount === undefined) && !opts.urn) {
                throw new Error("Missing required property 'notificationsEmailAccount'");
            }
            if ((!args || args.pullLambdaName === undefined) && !opts.urn) {
                throw new Error("Missing required property 'pullLambdaName'");
            }
            if ((!args || args.runtime === undefined) && !opts.urn) {
                throw new Error("Missing required property 'runtime'");
            }
            if ((!args || args.userPoolId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'userPoolId'");
            }
            resourceInputs['codePath'] = args ? args.codePath : undefined;
            resourceInputs['invokePullPolicyArn'] = args ? args.invokePullPolicyArn : undefined;
            resourceInputs['notificationsEmailAccount'] = args ? args.notificationsEmailAccount : undefined;
            resourceInputs['pullLambdaName'] = args ? args.pullLambdaName : undefined;
            resourceInputs['runtime'] = args ? args.runtime : undefined;
            resourceInputs['userPoolId'] = args ? args.userPoolId : undefined;
        } else {
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(CustomMailer.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a CustomMailer resource.
 */
export interface CustomMailerArgs {
    /**
     * The path to the .zip for the lambda code.
     */
    codePath: pulumi.Input<string>;
    /**
     * The ARN of the pull lambda function.
     */
    invokePullPolicyArn: pulumi.Input<string>;
    notificationsEmailAccount: pulumi.Input<inputs.NotificationsEmailAccountArgs>;
    /**
     * The name of the pull lambda function that is used to pull message templates.
     */
    pullLambdaName: pulumi.Input<string>;
    /**
     * The lambda runtime.
     */
    runtime: pulumi.Input<string>;
    /**
     * The ID of the cognito user pool that should be updated with the custom mailer.
     */
    userPoolId: pulumi.Input<string>;
}
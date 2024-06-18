import * as pulumi from '@pulumi/pulumi';
import * as inputs from './types/input';
export declare class CustomMailer extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of CustomMailer.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is CustomMailer;
    /**
     * Create a CustomMailer resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CustomMailerArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a CustomMailer resource.
 */
export interface CustomMailerArgs {
    /**
     * The path to the .zip for the lambda code.
     */
    codePath?: pulumi.Input<string>;
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

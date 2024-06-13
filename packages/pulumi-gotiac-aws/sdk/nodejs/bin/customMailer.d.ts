import * as pulumi from '@pulumi/pulumi';
export declare class CustomMailer extends pulumi.CustomResource {
    /**
     * Get an existing CustomMailer resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, opts?: pulumi.CustomResourceOptions): CustomMailer;
    /**
     * Returns true if the given object is an instance of CustomMailer.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is CustomMailer;
    /**
     * The path to the .zip for the lambda code.
     */
    readonly codePath: pulumi.Output<string>;
    /**
     * The ARN of the pull lambda function.
     */
    readonly invokePullPolicyArn: pulumi.Output<string>;
    /**
     * Notifications email account in the format of `$ echo "sender|host|user|password|port|secureFlag" | base64`.
     */
    readonly notificationsEmailAccount: pulumi.Output<string>;
    /**
     * The name of the pull lambda function that is used to pull message templates.
     */
    readonly pullLambdaName: pulumi.Output<string>;
    /**
     * The lambda runtime.
     */
    readonly runtime: pulumi.Output<string>;
    /**
     * The ID of the cognito user pool that should be updated with the custom mailer.
     */
    readonly userPoolId: pulumi.Output<string>;
    /**
     * Create a CustomMailer resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: CustomMailerArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * The set of arguments for constructing a CustomMailer resource.
 */
export interface CustomMailerArgs {}

import * as pulumi from "@pulumi/pulumi";
export declare class MailUser extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of MailUser.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is MailUser;
    /**
     * The password of the new user.
     */
    readonly password: pulumi.Output<string>;
    /**
     * The ID of the organization that can be used to create mailboxes
     */
    readonly userId: pulumi.Output<string>;
    /**
     * Create a MailUser resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: MailUserArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a MailUser resource.
 */
export interface MailUserArgs {
    /**
     * The display name for the new user.
     */
    displayName: pulumi.Input<string>;
    /**
     * The mail domain of the organization for which the user is created. Either organizationId or domain must be specified.
     */
    domain?: pulumi.Input<string>;
    /**
     * The email prefix for the new user. (prefix@domain.com). The default domain of the organization will be appended automatically.
     */
    emailPrefix: pulumi.Input<string>;
    /**
     * Whether the mailbox for the user is enabled.
     */
    enabled: pulumi.Input<boolean>;
    /**
     * The first name of the new user.
     */
    firstName?: pulumi.Input<string>;
    /**
     * The last name of the new user.
     */
    lastName?: pulumi.Input<string>;
    /**
     * The name for the new user. WorkMail directory user names have a maximum length of 64. All others have a maximum length of 20.
     */
    name: pulumi.Input<string>;
    /**
     * The identifier of the organization for which the user is created. Either organizationId or domain must be specified.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * The region to create the mail domain in
     */
    region: pulumi.Input<string>;
}

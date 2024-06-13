import * as pulumi from '@pulumi/pulumi';
export declare class MailDomain extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of MailDomain.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is MailDomain;
    /**
     * The IMAP server host for the mail domain
     */
    readonly imapServer: pulumi.Output<string>;
    /**
     * The ID of the organization that can be used to create mailboxes
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * Create a MailDomain resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: MailDomainArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a MailDomain resource.
 */
export interface MailDomainArgs {
    /**
     * The domain to be used for the mailboxes
     */
    domain: pulumi.Input<string>;
    /**
     * The aws region to create the domain in.
     */
    region: pulumi.Input<string>;
}

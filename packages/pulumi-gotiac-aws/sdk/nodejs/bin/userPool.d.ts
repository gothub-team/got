import * as pulumi from "@pulumi/pulumi";
export declare class UserPool extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of UserPool.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is UserPool;
    /**
     * The ID of the cognito user pool that was created.
     */
    readonly userPoolId: pulumi.Output<string>;
    /**
     * Create a UserPool resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: UserPoolArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a UserPool resource.
 */
export interface UserPoolArgs {
}

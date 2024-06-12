import * as pulumi from '@pulumi/pulumi';
export declare class TestUser extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of TestUser.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is TestUser;
    /**
     * The temporary password of the test user. Make sure to destroy the test user after each test run.
     */
    readonly password: pulumi.Output<string>;
    /**
     * Create a TestUser resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: TestUserArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a TestUser resource.
 */
export interface TestUserArgs {
    /**
     * The email of the test user. Throws an error if the user already exists.
     */
    email: pulumi.Input<string>;
    /**
     * The ID of the user pool where the test user is created. UserPool must exist.
     */
    userPoolId: pulumi.Input<string>;
}

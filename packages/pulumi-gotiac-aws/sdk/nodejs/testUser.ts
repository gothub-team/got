// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

export class TestUser extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'gotiac:index:TestUser';

    /**
     * Returns true if the given object is an instance of TestUser.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is TestUser {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === TestUser.__pulumiType;
    }

    /**
     * The temporary password of the test user. Make sure to destroy the test user after each test run.
     */
    public /*out*/ readonly password!: pulumi.Output<string>;

    /**
     * Create a TestUser resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: TestUserArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.email === undefined) && !opts.urn) {
                throw new Error("Missing required property 'email'");
            }
            if ((!args || args.userPoolId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'userPoolId'");
            }
            resourceInputs["email"] = args ? args.email : undefined;
            resourceInputs["userPoolId"] = args ? args.userPoolId : undefined;
            resourceInputs["password"] = undefined /*out*/;
        } else {
            resourceInputs["password"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(TestUser.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
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
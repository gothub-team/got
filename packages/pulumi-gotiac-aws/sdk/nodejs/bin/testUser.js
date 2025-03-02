'use strict';
// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, '__esModule', { value: true });
exports.TestUser = void 0;
const pulumi = require('@pulumi/pulumi');
const utilities = require('./utilities');
class TestUser extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of TestUser.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj) {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === TestUser.__pulumiType;
    }
    /**
     * Create a TestUser resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name, args, opts) {
        let resourceInputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.email === undefined) && !opts.urn) {
                throw new Error("Missing required property 'email'");
            }
            if ((!args || args.userPoolId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'userPoolId'");
            }
            resourceInputs['email'] = args ? args.email : undefined;
            resourceInputs['userPoolId'] = args ? args.userPoolId : undefined;
            resourceInputs['password'] = undefined /*out*/;
        } else {
            resourceInputs['password'] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(TestUser.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}
exports.TestUser = TestUser;
/** @internal */
TestUser.__pulumiType = 'gotiac:index:TestUser';
//# sourceMappingURL=testUser.js.map

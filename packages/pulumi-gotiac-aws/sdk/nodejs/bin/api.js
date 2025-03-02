'use strict';
// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, '__esModule', { value: true });
exports.Api = void 0;
const pulumi = require('@pulumi/pulumi');
const utilities = require('./utilities');
class Api extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Api.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj) {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Api.__pulumiType;
    }
    /**
     * Create a Api resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name, args, opts) {
        let resourceInputs = {};
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
exports.Api = Api;
/** @internal */
Api.__pulumiType = 'gotiac:index:Api';
//# sourceMappingURL=api.js.map

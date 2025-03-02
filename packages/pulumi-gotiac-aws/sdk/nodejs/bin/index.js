'use strict';
// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, '__esModule', { value: true });
exports.types =
    exports.UserPool =
    exports.TestUser =
    exports.Provider =
    exports.MailUser =
    exports.MailDomain =
    exports.GraphStore =
    exports.FileHosting =
    exports.CustomMailer =
    exports.Api =
        void 0;
const pulumi = require('@pulumi/pulumi');
const utilities = require('./utilities');
exports.Api = null;
utilities.lazyLoad(exports, ['Api'], () => require('./api'));
exports.CustomMailer = null;
utilities.lazyLoad(exports, ['CustomMailer'], () => require('./customMailer'));
exports.FileHosting = null;
utilities.lazyLoad(exports, ['FileHosting'], () => require('./fileHosting'));
exports.GraphStore = null;
utilities.lazyLoad(exports, ['GraphStore'], () => require('./graphStore'));
exports.MailDomain = null;
utilities.lazyLoad(exports, ['MailDomain'], () => require('./mailDomain'));
exports.MailUser = null;
utilities.lazyLoad(exports, ['MailUser'], () => require('./mailUser'));
exports.Provider = null;
utilities.lazyLoad(exports, ['Provider'], () => require('./provider'));
exports.TestUser = null;
utilities.lazyLoad(exports, ['TestUser'], () => require('./testUser'));
exports.UserPool = null;
utilities.lazyLoad(exports, ['UserPool'], () => require('./userPool'));
// Export sub-modules:
const types = require('./types');
exports.types = types;
const _module = {
    version: utilities.getVersion(),
    construct: (name, type, urn) => {
        switch (type) {
            case 'gotiac:index:Api':
                return new exports.Api(name, undefined, { urn });
            case 'gotiac:index:CustomMailer':
                return new exports.CustomMailer(name, undefined, { urn });
            case 'gotiac:index:FileHosting':
                return new exports.FileHosting(name, undefined, { urn });
            case 'gotiac:index:GraphStore':
                return new exports.GraphStore(name, undefined, { urn });
            case 'gotiac:index:MailDomain':
                return new exports.MailDomain(name, undefined, { urn });
            case 'gotiac:index:MailUser':
                return new exports.MailUser(name, undefined, { urn });
            case 'gotiac:index:TestUser':
                return new exports.TestUser(name, undefined, { urn });
            case 'gotiac:index:UserPool':
                return new exports.UserPool(name, undefined, { urn });
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    },
};
pulumi.runtime.registerResourceModule('gotiac', 'index', _module);
pulumi.runtime.registerResourcePackage('gotiac', {
    version: utilities.getVersion(),
    constructProvider: (name, type, urn) => {
        if (type !== 'pulumi:providers:gotiac') {
            throw new Error(`unknown provider type ${type}`);
        }
        return new exports.Provider(name, undefined, { urn });
    },
});
//# sourceMappingURL=index.js.map

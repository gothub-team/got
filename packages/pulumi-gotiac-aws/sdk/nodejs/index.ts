// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from '@pulumi/pulumi';
import * as utilities from './utilities';

// Export members:
export { ApiArgs } from './api';
export type Api = import('./api').Api;
export const Api: typeof import('./api').Api = null as any;
utilities.lazyLoad(exports, ['Api'], () => require('./api'));

export { CustomMailerArgs } from './customMailer';
export type CustomMailer = import('./customMailer').CustomMailer;
export const CustomMailer: typeof import('./customMailer').CustomMailer = null as any;
utilities.lazyLoad(exports, ['CustomMailer'], () => require('./customMailer'));

export { FileHostingArgs } from './fileHosting';
export type FileHosting = import('./fileHosting').FileHosting;
export const FileHosting: typeof import('./fileHosting').FileHosting = null as any;
utilities.lazyLoad(exports, ['FileHosting'], () => require('./fileHosting'));

export { GraphStoreArgs } from './graphStore';
export type GraphStore = import('./graphStore').GraphStore;
export const GraphStore: typeof import('./graphStore').GraphStore = null as any;
utilities.lazyLoad(exports, ['GraphStore'], () => require('./graphStore'));

export { MailDomainArgs } from './mailDomain';
export type MailDomain = import('./mailDomain').MailDomain;
export const MailDomain: typeof import('./mailDomain').MailDomain = null as any;
utilities.lazyLoad(exports, ['MailDomain'], () => require('./mailDomain'));

export { MailUserArgs } from './mailUser';
export type MailUser = import('./mailUser').MailUser;
export const MailUser: typeof import('./mailUser').MailUser = null as any;
utilities.lazyLoad(exports, ['MailUser'], () => require('./mailUser'));

export { ProviderArgs } from './provider';
export type Provider = import('./provider').Provider;
export const Provider: typeof import('./provider').Provider = null as any;
utilities.lazyLoad(exports, ['Provider'], () => require('./provider'));

export { TestUserArgs } from './testUser';
export type TestUser = import('./testUser').TestUser;
export const TestUser: typeof import('./testUser').TestUser = null as any;
utilities.lazyLoad(exports, ['TestUser'], () => require('./testUser'));

export { UserPoolArgs } from './userPool';
export type UserPool = import('./userPool').UserPool;
export const UserPool: typeof import('./userPool').UserPool = null as any;
utilities.lazyLoad(exports, ['UserPool'], () => require('./userPool'));

// Export sub-modules:
import * as types from './types';

export { types };

const _module = {
    version: utilities.getVersion(),
    construct: (name: string, type: string, urn: string): pulumi.Resource => {
        switch (type) {
            case 'gotiac:index:Api':
                return new Api(name, <any>undefined, { urn });
            case 'gotiac:index:CustomMailer':
                return new CustomMailer(name, <any>undefined, { urn });
            case 'gotiac:index:FileHosting':
                return new FileHosting(name, <any>undefined, { urn });
            case 'gotiac:index:GraphStore':
                return new GraphStore(name, <any>undefined, { urn });
            case 'gotiac:index:MailDomain':
                return new MailDomain(name, <any>undefined, { urn });
            case 'gotiac:index:MailUser':
                return new MailUser(name, <any>undefined, { urn });
            case 'gotiac:index:TestUser':
                return new TestUser(name, <any>undefined, { urn });
            case 'gotiac:index:UserPool':
                return new UserPool(name, <any>undefined, { urn });
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    },
};
pulumi.runtime.registerResourceModule('gotiac', 'index', _module);
pulumi.runtime.registerResourcePackage('gotiac', {
    version: utilities.getVersion(),
    constructProvider: (name: string, type: string, urn: string): pulumi.ProviderResource => {
        if (type !== 'pulumi:providers:gotiac') {
            throw new Error(`unknown provider type ${type}`);
        }
        return new Provider(name, <any>undefined, { urn });
    },
});

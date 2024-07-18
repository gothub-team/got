"use strict";
// *** WARNING: this file was generated by pulumi-language-nodejs. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAsync = exports.lazyLoad = exports.resourceOptsDefaults = exports.getVersion = exports.getEnvNumber = exports.getEnvBoolean = exports.getEnv = void 0;
const runtime = require("@pulumi/pulumi/runtime");
function getEnv(...vars) {
    for (const v of vars) {
        const value = process.env[v];
        if (value) {
            return value;
        }
    }
    return undefined;
}
exports.getEnv = getEnv;
function getEnvBoolean(...vars) {
    const s = getEnv(...vars);
    if (s !== undefined) {
        // NOTE: these values are taken from https://golang.org/src/strconv/atob.go?s=351:391#L1, which is what
        // Terraform uses internally when parsing boolean values.
        if (["1", "t", "T", "true", "TRUE", "True"].find(v => v === s) !== undefined) {
            return true;
        }
        if (["0", "f", "F", "false", "FALSE", "False"].find(v => v === s) !== undefined) {
            return false;
        }
    }
    return undefined;
}
exports.getEnvBoolean = getEnvBoolean;
function getEnvNumber(...vars) {
    const s = getEnv(...vars);
    if (s !== undefined) {
        const f = parseFloat(s);
        if (!isNaN(f)) {
            return f;
        }
    }
    return undefined;
}
exports.getEnvNumber = getEnvNumber;
function getVersion() {
    let version = require('./package.json').version;
    // Node allows for the version to be prefixed by a "v", while semver doesn't.
    // If there is a v, strip it off.
    if (version.indexOf('v') === 0) {
        version = version.slice(1);
    }
    return version;
}
exports.getVersion = getVersion;
/** @internal */
function resourceOptsDefaults() {
    return { version: getVersion(), pluginDownloadURL: "https://github.com/gothub-team/got/releases/download/packages/pulumi-gotiac-aws/v0.1.14" };
}
exports.resourceOptsDefaults = resourceOptsDefaults;
/** @internal */
function lazyLoad(exports, props, loadModule) {
    for (let property of props) {
        Object.defineProperty(exports, property, {
            enumerable: true,
            get: function () {
                return loadModule()[property];
            },
        });
    }
}
exports.lazyLoad = lazyLoad;
function callAsync(tok, props, res, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const o = runtime.call(tok, props, res);
        const value = yield o.promise(true /*withUnknowns*/);
        const isKnown = yield o.isKnown;
        const isSecret = yield o.isSecret;
        const problem = !isKnown ? "an unknown value"
            : isSecret ? "a secret value"
                : undefined;
        // Ingoring o.resources silently. They are typically non-empty, r.f() calls include r as a dependency.
        if (problem) {
            throw new Error(`Plain resource method "${tok}" incorrectly returned ${problem}. ` +
                "This is an error in the provider, please report this to the provider developer.");
        }
        // Extract a single property if requested.
        if (opts && opts.property) {
            return value[opts.property];
        }
        return value;
    });
}
exports.callAsync = callAsync;
//# sourceMappingURL=utilities.js.map
// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.Gotiac
{
    [GotiacResourceType("gotiac:index:TestUser")]
    public partial class TestUser : global::Pulumi.ComponentResource
    {
        /// <summary>
        /// The temporary password of the test user. Make sure to destroy the test user after each test run.
        /// </summary>
        [Output("password")]
        public Output<string> Password { get; private set; } = null!;


        /// <summary>
        /// Create a TestUser resource with the given unique name, arguments, and options.
        /// </summary>
        ///
        /// <param name="name">The unique name of the resource</param>
        /// <param name="args">The arguments used to populate this resource's properties</param>
        /// <param name="options">A bag of options that control this resource's behavior</param>
        public TestUser(string name, TestUserArgs args, ComponentResourceOptions? options = null)
            : base("gotiac:index:TestUser", name, args ?? new TestUserArgs(), MakeResourceOptions(options, ""), remote: true)
        {
        }

        private static ComponentResourceOptions MakeResourceOptions(ComponentResourceOptions? options, Input<string>? id)
        {
            var defaultOptions = new ComponentResourceOptions
            {
                Version = Utilities.Version,
                PluginDownloadURL = "https://api.github.com/gothub-team/got",
            };
            var merged = ComponentResourceOptions.Merge(defaultOptions, options);
            // Override the ID if one was specified for consistency with other language SDKs.
            merged.Id = id ?? merged.Id;
            return merged;
        }
    }

    public sealed class TestUserArgs : global::Pulumi.ResourceArgs
    {
        /// <summary>
        /// The email of the test user. Throws an error if the user already exists.
        /// </summary>
        [Input("email", required: true)]
        public Input<string> Email { get; set; } = null!;

        /// <summary>
        /// The ID of the user pool where the test user is created. UserPool must exist.
        /// </summary>
        [Input("userPoolId", required: true)]
        public Input<string> UserPoolId { get; set; } = null!;

        public TestUserArgs()
        {
        }
        public static new TestUserArgs Empty => new TestUserArgs();
    }
}


package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi-random/sdk/v4/go/random"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a ApiEndpoint component resource.
type ApiEndpointUserArgs struct {
	// The ID of the user pool where the test admin user is created. UserPool must exist.
	UserPoolId pulumi.StringInput `pulumi:"userPoolId"`
	// The email of the test admin user. Throws an error if the user already exists.
	Email pulumi.StringInput `pulumi:"email"`
}

// The ApiEndpoint component resource.
type ApiEndpoint struct {
	pulumi.ResourceState

	// The temporary password of the test admin user. Make sure to destroy the test admin user after each
	// test run.
	Password pulumi.StringOutput `pulumi:"password"`
}

// NewApiEndpoint creates a new ApiEndpoint component resource.
func NewApiEndpoint(ctx *pulumi.Context,
	name string, args *ApiEndpointUserArgs, opts ...pulumi.ResourceOption) (*ApiEndpoint, error) {
	if args == nil {
		args = &ApiEndpointUserArgs{}
	}

	component := &ApiEndpoint{}
	err := ctx.RegisterComponentResource("gotiac:index:ApiEndpoint", name, component, opts...)
	if err != nil {
		return nil, err
	}

	

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		//"password": component.Password,
	}); err != nil {
		return nil, err
	}

	return component, nil
}

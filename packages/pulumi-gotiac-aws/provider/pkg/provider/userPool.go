package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a UserPool component resource.
type UserPoolArgs struct {
}

// The UserPool component resource.
type UserPool struct {
	pulumi.ResourceState
	UserPoolId pulumi.StringOutput `pulumi:"userPoolId"`
}

// NewUserPool creates a new UserPool component resource.
func NewUserPool(ctx *pulumi.Context,
	name string, args *UserPoolArgs, opts ...pulumi.ResourceOption) (*UserPool, error) {
	if args == nil {
		args = &UserPoolArgs{}
	}

	component := &UserPool{}
	err := ctx.RegisterComponentResource("gotiac:index:UserPool", name, component, opts...)
	if err != nil {
		return nil, err
	}

	userPool, err := cognito.NewUserPool(ctx, name, &cognito.UserPoolArgs{
		MfaConfiguration: pulumi.String("OFF"),
		UsernameAttributes: pulumi.StringArray{
			pulumi.String("email"),
		},
		AutoVerifiedAttributes: pulumi.StringArray{
			pulumi.String("email"),
		},
		PasswordPolicy: &cognito.UserPoolPasswordPolicyArgs{
			MinimumLength:    pulumi.Int(6),
			RequireLowercase: pulumi.Bool(false),
			RequireNumbers:   pulumi.Bool(true),
			RequireSymbols:   pulumi.Bool(false),
			RequireUppercase: pulumi.Bool(false),
		},
	}, pulumi.IgnoreChanges([]string{"passwordPolicy"}))
	if err != nil {
		return nil, err
	}

	component.UserPoolId = userPool.ID().ToIDOutput().ToStringOutput()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{}); err != nil {
		return nil, err
	}

	return component, nil
}

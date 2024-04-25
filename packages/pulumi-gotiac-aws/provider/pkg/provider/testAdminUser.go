package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi-random/sdk/v4/go/random"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a TestAdminUser component resource.
type TestAdminUserArgs struct {
	// The ID of the user pool where the test admin user is created. UserPool must exist.
	UserPoolId pulumi.StringInput `pulumi:"userPoolId"`
	// The email of the test admin user. Throws an error if the user already exists.
	Email pulumi.StringInput `pulumi:"email"`
}

// The TestAdminUser component resource.
type TestAdminUser struct {
	pulumi.ResourceState

	// The temporary password of the test admin user. Make sure to destroy the test admin user after each
	// test run.
	Password pulumi.StringOutput `pulumi:"password"`
}

// NewTestAdminUser creates a new TestAdminUser component resource.
func NewTestAdminUser(ctx *pulumi.Context,
	name string, args *TestAdminUserArgs, opts ...pulumi.ResourceOption) (*TestAdminUser, error) {
	if args == nil {
		args = &TestAdminUserArgs{}
	}

	component := &TestAdminUser{}
	err := ctx.RegisterComponentResource("gotiac:index:TestAdminUser", name, component, opts...)
	if err != nil {
		return nil, err
	}

	// Create a random password for the test admin user.
	password, err := random.NewRandomPassword(ctx, "password", &random.RandomPasswordArgs{
		Length:     pulumi.Int(64),
		MinLower:   pulumi.Int(1),
		MinUpper:   pulumi.Int(1),
		MinNumeric: pulumi.Int(1),
		MinSpecial: pulumi.Int(1),
	})
	if err != nil {
		return nil, err
	}

	// Create a cognito user with the given email and password.
	if _, err := cognito.NewUser(ctx, name, &cognito.UserArgs{
		UserPoolId:    args.UserPoolId,
		Username:      args.Email,
		MessageAction: pulumi.String("SUPPRESS"),
		Password:      password.Result,
		Attributes: pulumi.StringMap{
			"email":          args.Email,
			"email_verified": pulumi.String("true"),
		},
		Enabled: pulumi.Bool(true),
	}); err != nil {
		return nil, err
	}

	component.Password = password.Result

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"password": component.Password,
	}); err != nil {
		return nil, err
	}

	return component, nil
}

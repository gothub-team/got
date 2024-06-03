package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a Userpool component resource.
type UserpoolArgs struct {
	UserPoolId pulumi.IDInput `pulumi:"userPoolId"`
}

// The Userpool component resource.
type Userpool struct {
	pulumi.ResourceState
	UserPool           cognito.UserPoolOutput       `pulumi:"userPool"`
	UserPoolId         pulumi.StringOutput          `pulumi:"userPoolId"`
	UserPoolEndpoint   pulumi.StringOutput          `pulumi:"userPoolEndpoint"`
	UserPoolClient     cognito.UserPoolClientOutput `pulumi:"userPoolClient"`
	UserPoolClientId   pulumi.StringOutput          `pulumi:"userPoolClientId"`
	AuthUserPolicyArn  pulumi.StringOutput          `pulumi:"authUserPolicyArn"`
	AuthAdminPolicyArn pulumi.StringOutput          `pulumi:"authAdminPolicyArn"`
}

// NewUserpool creates a new Userpool component resource.
func NewUserpool(ctx *pulumi.Context,
	name string, args *UserpoolArgs, opts ...pulumi.ResourceOption) (*Userpool, error) {
	if args == nil {
		args = &UserpoolArgs{}
	}

	component := &Userpool{}
	err := ctx.RegisterComponentResource("gotiac:index:Userpool", name, component, opts...)
	if err != nil {
		return nil, err
	}

	userPool, err := cognito.GetUserPool(ctx, name, args.UserPoolId, &cognito.UserPoolState{})
	if err != nil {
		return nil, err
	}

	userPoolClient, err := cognito.NewUserPoolClient(ctx, name+"-userpoolclient", &cognito.UserPoolClientArgs{
		Name:           pulumi.String("client"),
		UserPoolId:     userPool.ID(),
		GenerateSecret: pulumi.Bool(true),
		ExplicitAuthFlows: pulumi.StringArray{
			pulumi.String("ADMIN_NO_SRP_AUTH"),
		},
	})
	if err != nil {
		return nil, err
	}

	authUserPolicy, err := iam.NewPolicy(ctx, name+"-auth-user-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"cognito-idp:InitiateAuth",
						"cognito-idp:RespondToAuthChallenge",
						"cognito-idp:SignUp",
						"cognito-idp:ConfirmSignUp",
						"cognito-idp:ResendConfirmationCode",
						"cognito-idp:ForgotPassword",
						"cognito-idp:ConfirmForgotPassword",
					},
					"Resource": []interface{}{
						userPool.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	authAdminPolicy, err := iam.NewPolicy(ctx, name+"-auth-admin-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"cognito-idp:AdminGetUser",
						"cognito-idp:AdminCreateUser",
						"cognito-idp:AdminDeleteUser",
						"cognito-idp:AdminInitiateAuth",
						"cognito-idp:AdminRespondToAuthChallenge",
						"cognito-idp:AdminUpdateUserAttributes",
						"cognito-idp:AdminSetUserPassword",
					},
					"Resource": []interface{}{
						userPool.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	component.UserPool = userPool.ToUserPoolOutput()
	component.UserPoolId = userPool.ID().ApplyT(func(id string) pulumi.String {
		return pulumi.String(id)
	}).(pulumi.StringOutput)
	component.UserPoolEndpoint = userPool.Endpoint
	component.UserPoolClient = userPoolClient.ToUserPoolClientOutput()
	component.UserPoolClientId = userPoolClient.ID().ApplyT(func(id string) pulumi.String {
		return pulumi.String(id)
	}).(pulumi.StringOutput)
	component.AuthUserPolicyArn = authUserPolicy.Arn
	component.AuthAdminPolicyArn = authAdminPolicy.Arn

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{}); err != nil {
		return nil, err
	}

	return component, nil
}

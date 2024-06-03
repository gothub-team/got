package provider

import (
	"fmt"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/apigatewayv2"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a Lambda component resource.
type ApiArgs struct {
	// The APIs execution ARN
	UserPoolId pulumi.IDInput `pulumi:"userPoolId"`
	// The the path to the .zip for the lambda code
	CodePath pulumi.StringInput `pulumi:"codePath"`
	// The lambda runtime
	Runtime pulumi.StringInput `pulumi:"runtime"`
	// The array of policy arns that should be attachen to the lambda function role
	PolicyArns pulumi.StringArrayInput `pulumi:"policyArns"`
	BucketNodesName *pulumi.StringInput `pulumi:"bucketNodesName"`
	BucketEdgesName *pulumi.StringInput `pulumi:"bucketEdgesName"`
	BucketReverseEdgesName *pulumi.StringInput `pulumi:"bucketReverseEdgesName"`
	BucketRightsReadName *pulumi.StringInput `pulumi:"bucketRightsReadName"`
	BucketRightsWriteName *pulumi.StringInput `pulumi:"bucketRightsWriteName"`
	BucketRightsAdminName *pulumi.StringInput `pulumi:"bucketRightsAdminName"`
	BucketRightsOwnerName *pulumi.StringInput `pulumi:"bucketRightsOwnerName"`
}

// The Api component resource.
type Api struct {
	pulumi.ResourceState
	// Route apigatewayv2.Route `pulumi:"route"`
	Endpoint pulumi.StringOutput `pulumi:"endpoint"`
	PullFunction lambda.FunctionOutput `pulumi:"pullFunction"`
	PullEndpoint pulumi.StringOutput `pulumi:"pullEndpoint"`
	PushFunction lambda.FunctionOutput `pulumi:"pushFunction"`
	PushEndpoint pulumi.StringOutput `pulumi:"pushEndpoint"`
	PullInvokePolicyArn pulumi.StringOutput `pulumi:"pullInvokePolicyArn"`
	PushInvokePolicyArn pulumi.StringOutput `pulumi:"pushInvokePolicyArn"`
	AuthLoginInitEndpoint pulumi.StringOutput `pulumi:"authLoginInitEndpoint"`
	AuthLoginVerifyEndpoint pulumi.StringOutput `pulumi:"authLoginVerifyEndpoint"`
	AuthLoginRefreshEndpoint pulumi.StringOutput `pulumi:"authLoginRefreshEndpoint"`
	AuthRegisterInitEndpoint pulumi.StringOutput `pulumi:"authRegisterInitEndpoint"`
	AuthRegisterVerifyEndpoint pulumi.StringOutput `pulumi:"authRegisterVerifyEndpoint"`
	AuthRegisterVerifyResendEndpoint pulumi.StringOutput `pulumi:"authRegisterVerifyResendEndpoint"`
	AuthResetPasswordInitEndpoint pulumi.StringOutput `pulumi:"authResetPasswordInitEndpoint"`
	AuthResetPasswordVerifyEndpoint pulumi.StringOutput `pulumi:"authResetPasswordVerifyEndpoint"`
	AuthInviteUserEndpoint pulumi.StringOutput `pulumi:"authInviteUserEndpoint"`
}

// NewApi creates a new Lambda component resource.
func NewApi(ctx *pulumi.Context,
	name string, args *ApiArgs, opts ...pulumi.ResourceOption) (*Api, error) {
	if args == nil {
		args = &ApiArgs{}
	}

	component := &Api{}
	err := ctx.RegisterComponentResource("gotiac:index:Api", name, component, opts...)
	if err != nil {
		return nil, err
	}

	corsConfiguration := &apigatewayv2.ApiCorsConfigurationArgs{
		AllowCredentials: pulumi.Bool(false),
		AllowHeaders: pulumi.StringArray{
			pulumi.String("Content-Type"),
			pulumi.String("X-Amz-Date"),
			pulumi.String("Authorization"),
			pulumi.String("X-Api-Key"),
			pulumi.String("X-Amz-Security-Token"),
			pulumi.String("X-Amz-User-Agent"),
			pulumi.String("Access-Control-Allow-Headers"),
			pulumi.String("Access-Control-Allow-Origin"),
			pulumi.String("x-as-admin"),
			pulumi.String("x-as-role"),
		},
		AllowMethods: pulumi.StringArray{
			pulumi.String("POST"),
		},
		AllowOrigins: pulumi.StringArray{
			pulumi.String("*"),
		},
		// ExposeHeaders: pulumi.StringArray{
		// 	pulumi.String("string"),
		// },
		// MaxAge: pulumi.Int(0),
	}

	api, err := apigatewayv2.NewApi(ctx, "test-api", &apigatewayv2.ApiArgs{
		ProtocolType:   pulumi.String("HTTP"),
		// FailOnWarnings: pulumi.Bool(false),
		CorsConfiguration: corsConfiguration,
	})
	if err != nil {
		return nil, err
	}

	stage, err := apigatewayv2.NewStage(ctx, "test-api-stage", &apigatewayv2.StageArgs{
		ApiId: api.ID(),
		AutoDeploy: pulumi.Bool(true),
	})
	if err != nil {
		return nil, err
	}

	auth, err := NewUserpool(ctx, name + "-userpool", &UserpoolArgs{
		UserPoolId: args.UserPoolId,
	})
	if err != nil {
		return nil, err
	}

	auth.UserPoolClient.ApplyT(func(client *cognito.UserPoolClient) (pulumi.IDOutput) {
		return client.ID()
	})

	// Create Cognito Authorizer
	authorizer, err := apigatewayv2.NewAuthorizer(ctx, fmt.Sprintf("%s-Authorizer", name), &apigatewayv2.AuthorizerArgs{
		ApiId: api.ID(),
		AuthorizerType: pulumi.String("JWT"),
		IdentitySources: pulumi.StringArray{
			pulumi.String("$request.header.Authorization"),
		},
		JwtConfiguration: &apigatewayv2.AuthorizerJwtConfigurationArgs{
			Audiences: pulumi.StringArray{
				auth.UserPoolId,
			},
			Issuer: pulumi.Sprintf("https://%s", auth.UserPoolEndpoint),
		},
	})
	if err != nil {
		return nil, err
	}

	graphStore, err := NewGraphStore(ctx, name + "-graph-store", &GraphStoreArgs{
		BucketNodesName: args.BucketNodesName,
		BucketEdgesName: args.BucketEdgesName,
		BucketReverseEdgesName: args.BucketReverseEdgesName,
		BucketRightsReadName: args.BucketRightsReadName,
		BucketRightsWriteName: args.BucketRightsWriteName,
		BucketRightsAdminName: args.BucketRightsAdminName,
		BucketRightsOwnerName: args.BucketRightsOwnerName,
	})
	if err != nil {
		return nil, err
	}

	pullMem := pulumi.Int(2048)
	pullEnv := pulumi.StringMap{
		"BUCKET_NODES": graphStore.BucketNodesName,
		"BUCKET_EDGES": graphStore.BucketEdgesName,
		"BUCKET_REVERSE_EDGES": graphStore.BucketReverseEdgesName,
		"BUCKET_RIGHTS_READ": graphStore.BucketRightsReadName,
		"BUCKET_RIGHTS_WRITE": graphStore.BucketRightsWriteName,
		"BUCKET_RIGHTS_ADMIN": graphStore.BucketRightsAdminName,
		"BUCKET_OWNERS": graphStore.BucketRightsOwnerName,
	}

	pullLambda, err := NewLambda(ctx, name + "PullInternal", &LambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/pull.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleInvoke"),
		MemorySize: &pullMem,
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
		},
		Environment: pullEnv,
	})
	if err != nil {
		return nil, err
	}

	pullLambdaInvokePolicy, err := iam.NewPolicy(ctx, name + "-invoke-pull-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy:      pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"lambda:InvokeFunction",
					},
					"Resource": []interface{}{
						pullLambda.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	pullApiLambda, err := NewApiLambda(ctx, name + "PullApi", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/pull.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &pullMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/pull"),
		Environment: pullEnv,
	})
	if err != nil {
		return nil, err
	}

	pushMem := pulumi.Int(2048)
	pushEnv := pulumi.StringMap{
		"BUCKET_NODES": graphStore.BucketNodesName,
		"BUCKET_EDGES": graphStore.BucketEdgesName,
		"BUCKET_REVERSE_EDGES": graphStore.BucketReverseEdgesName,
		"BUCKET_RIGHTS_READ": graphStore.BucketRightsReadName,
		"BUCKET_RIGHTS_WRITE": graphStore.BucketRightsWriteName,
		"BUCKET_RIGHTS_ADMIN": graphStore.BucketRightsAdminName,
		"BUCKET_OWNERS": graphStore.BucketRightsOwnerName,
	}

	pushLambda, err := NewLambda(ctx, name + "PushInternal", &LambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/push.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleInvoke"),
		MemorySize: &pushMem,
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
			graphStore.StorageWritePolicyArn,
		},
		Environment: pushEnv,
	})
	if err != nil {
		return nil, err
	}

	pushLambdaInvokePolicy, err := iam.NewPolicy(ctx, name + "-invoke-push-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy:      pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"lambda:InvokeFunction",
					},
					"Resource": []interface{}{
						pushLambda.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	pushApiLambda, err := NewApiLambda(ctx, name + "PushApi", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/push.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &pushMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
			graphStore.StorageWritePolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/push"),
		Environment: pushEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthMem := pulumi.Int(512)
	AuthEnv := pulumi.StringMap{
		"USER_POOL_ID": auth.UserPoolId,
		"CLIENT_ID": auth.UserPoolClientId,
	}

	AuthLoginInitApiLambda, err := NewApiLambda(ctx, name + "AuthLoginInit", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/login-init.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/login-init"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthLoginVerifyApiLambda, err := NewApiLambda(ctx, name + "AuthLoginVerify", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/login-verify.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/login-verify"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthLoginRefreshApiLambda, err := NewApiLambda(ctx, name + "AuthLoginRefresh", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/login-refresh.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/login-refresh"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthRegisterInitApiLambda, err := NewApiLambda(ctx, name + "AuthRegisterInit", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/register-init.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/register-init"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthRegisterVerifyApiLambda, err := NewApiLambda(ctx, name + "AuthRegisterVerify", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/register-verify.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/register-verify"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}
	
	AuthRegisterVerifyResendApiLambda, err := NewApiLambda(ctx, name + "AuthRegisterVerifyResend", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/register-verify-resend.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/register-verify-resend"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}
	
	AuthResetPasswordInitApiLambda, err := NewApiLambda(ctx, name + "AuthResetPasswordInit", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/reset-password-init.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/reset-password-init"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}
	
	AuthResetPasswordVerifyApiLambda, err := NewApiLambda(ctx, name + "AuthResetPasswordVerify", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/reset-password-verify.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/reset-password-verify"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}
	
	// TODO this needs auth and higher memory maybe?
	AuthInviteUserApiLambda, err := NewApiLambda(ctx, name + "AuthInviteUser", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: pulumi.Sprintf("%s/auth/invite-user.zip", args.CodePath),
		HandlerPath: pulumi.String("index.handleHttp"),
		MemorySize: &AuthMem,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			auth.AuthUserPolicyArn,
		},
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: pulumi.String("/auth/invite-user"),
		Environment: AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	component.Endpoint = stage.InvokeUrl
	component.PullFunction = pullLambda.Function
	component.PullEndpoint = pullApiLambda.Route.RouteKey()
	component.PushFunction = pushLambda.Function
	component.PushEndpoint = pushApiLambda.Route.RouteKey()
	component.PullInvokePolicyArn = pullLambdaInvokePolicy.Arn
	component.PushInvokePolicyArn = pushLambdaInvokePolicy.Arn
	component.AuthLoginInitEndpoint = AuthLoginInitApiLambda.Route.RouteKey()
	component.AuthLoginVerifyEndpoint = AuthLoginVerifyApiLambda.Route.RouteKey()
	component.AuthLoginRefreshEndpoint = AuthLoginRefreshApiLambda.Route.RouteKey()
	component.AuthRegisterInitEndpoint = AuthRegisterInitApiLambda.Route.RouteKey()
	component.AuthRegisterVerifyEndpoint = AuthRegisterVerifyApiLambda.Route.RouteKey()
	component.AuthRegisterVerifyResendEndpoint = AuthRegisterVerifyResendApiLambda.Route.RouteKey()
	component.AuthResetPasswordInitEndpoint = AuthResetPasswordInitApiLambda.Route.RouteKey()
	component.AuthResetPasswordVerifyEndpoint = AuthResetPasswordVerifyApiLambda.Route.RouteKey()
	component.AuthInviteUserEndpoint = AuthInviteUserApiLambda.Route.RouteKey()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"endpoint": stage.InvokeUrl,
		"pullFunction": pullLambda.Function,
		"pullEndpoint": pullApiLambda.Route.RouteKey(),
	}); err != nil {
		return nil, err
	}

	return component, nil
}
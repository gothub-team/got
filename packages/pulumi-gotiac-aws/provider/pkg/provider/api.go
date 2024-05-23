package provider

import (
	"fmt"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/apigatewayv2"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a Lambda component resource.
type ApiArgs struct {
	// The APIs execution ARN
	UserPoolId pulumi.IDInput `pulumi:"userPoolId"`
	// The the path to the .zip for the lambda code
	CodePath pulumi.StringInput `pulumi:"codePath"`
	// The handler for the lambda function
	HandlerPath pulumi.StringInput `pulumi:"handlerPath"`
	// The api route path
	RoutePath pulumi.StringInput `pulumi:"routePath"`
	// The memory size for the lambda function
	MemorySize *pulumi.Int `pulumi:"memorySize"`
	// The lambda runtime
	Runtime pulumi.StringInput `pulumi:"runtime"`
	// The array of policy arns that should be attachen to the lambda function role
	PolicyArns pulumi.StringArrayInput `pulumi:"policyArns"`
}

// The Api component resource.
type Api struct {
	pulumi.ResourceState
	// // The name of the lambda resource
	// Name pulumi.StringOutput `pulumi:"name"`
	// // The ARN of the lambda resource
	// Arn pulumi.StringOutput `pulumi:"arn"`
	// // The role of the lambda resource
	// Role iam.RoleOutput `pulumi:"role"`
	// The role of the lambda resource
	Function lambda.FunctionOutput `pulumi:"function"`
	// // The role of the lambda resource
	// Route apigatewayv2.Route `pulumi:"route"`
	Endpoint pulumi.StringOutput `pulumi:"endpoint"`
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

	userPool, err := cognito.GetUserPool(ctx, name, args.UserPoolId, &cognito.UserPoolState{});
	if err != nil {
		return nil, err
	}

	userPoolClient, err := cognito.NewUserPoolClient(ctx, "api-client", &cognito.UserPoolClientArgs{
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

	// Create Cognito Authorizer
	authorizer, err := apigatewayv2.NewAuthorizer(ctx, fmt.Sprintf("%s-Authorizer", name), &apigatewayv2.AuthorizerArgs{
		ApiId: api.ID(),
		AuthorizerType: pulumi.String("JWT"),
		IdentitySources: pulumi.StringArray{
			pulumi.String("$request.header.Authorization"),
		},
		JwtConfiguration: &apigatewayv2.AuthorizerJwtConfigurationArgs{
			Audiences: userPoolClient.ID().ApplyT(func(id string) (pulumi.StringArray) {
				return pulumi.StringArray{
					pulumi.String(id),
				}
			}).(pulumi.StringArrayOutput),
			Issuer: userPool.Endpoint.ApplyT(func(endpoint string) (string) {
				return "https://" + endpoint
			}).(pulumi.StringOutput).ToStringPtrOutput(),
		},
	})
	if err != nil {
		return nil, err
	}

	apiLambda, err := NewApiLambda(ctx, "test-api-lambda", &ApiLambdaArgs{
		Runtime: args.Runtime,
		CodePath: args.CodePath,
		HandlerPath: args.HandlerPath,
		MemorySize: args.MemorySize,
		Method: pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: args.PolicyArns,
		ApiId: api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath: args.RoutePath,
		Environment: pulumi.StringMap{},
	})
	if err != nil {
		return nil, err
	}

	component.Endpoint = stage.InvokeUrl

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		// "name": lambdaFunction.Name,
		// "arn": lambdaFunction.Arn,
		// "role": lambdaFunction.Role,
		"function": apiLambda.Function,
		// "route": apiRoute,
		"endpoint": stage.InvokeUrl,
	}); err != nil {
		return nil, err
	}

	return component, nil
}
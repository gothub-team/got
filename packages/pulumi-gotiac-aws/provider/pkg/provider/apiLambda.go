package provider

import (
	"fmt"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/apigatewayv2"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a Lambda component resource.
type ApiLambdaArgs struct {
	// The the path to the .zip for the lambda code
	CodePath pulumi.StringInput `pulumi:"codePath"`
	// The handler for the lambda function
	HandlerPath pulumi.StringInput `pulumi:"handlerPath"`
	// The API ID for the API route
	ApiId pulumi.StringInput `pulumi:"apiId"`
	// The APIs execution ARN
	ExecutionArn pulumi.StringInput `pulumi:"executionArn"`
	// The api route path
	Method pulumi.StringInput `pulumi:"method"`
	// The api route path
	RoutePath pulumi.StringInput `pulumi:"routePath"`
	// The ID of the authorizer
	AuthorizerId pulumi.StringInput `pulumi:"authorizerId"`
	// The memory size for the lambda function
	MemorySize *pulumi.Int `pulumi:"memorySize"`
	// The lambda runtime
	Runtime pulumi.StringInput `pulumi:"runtime"`
	// The array of policy arns that should be attachen to the lambda function role
	PolicyArns pulumi.StringArrayInput `pulumi:"policyArns"`
}

// The ApiLambda component resource.
type ApiLambda struct {
	pulumi.ResourceState
	// The name of the lambda resource
	Name pulumi.StringOutput `pulumi:"name"`
	// The ARN of the lambda resource
	Arn pulumi.StringOutput `pulumi:"arn"`
	// The role of the lambda resource
	Role iam.RoleOutput `pulumi:"role"`
	// The role of the lambda resource
	Function lambda.FunctionOutput `pulumi:"function"`
	// The role of the lambda resource
	Route apigatewayv2.RouteOutput `pulumi:"route"`
}

// NewApiLambda creates a new Lambda component resource.
func NewApiLambda(ctx *pulumi.Context,
	name string, args *ApiLambdaArgs, opts ...pulumi.ResourceOption) (*ApiLambda, error) {
	if args == nil {
		args = &ApiLambdaArgs{}
	}

	component := &ApiLambda{}
	err := ctx.RegisterComponentResource("gotiac:index:ApiLambda", name, component, opts...)
	if err != nil {
		return nil, err
	}
 
	// Create the lambda function
	lambdaFunction, err := NewLambda(ctx, name, &LambdaArgs{
		CodePath:	 args.CodePath,
		HandlerPath: args.HandlerPath,
		MemorySize: args.MemorySize,
		Runtime: args.Runtime,
		PolicyArns: args.PolicyArns,
	})
	if err != nil {
		return nil, err
	}

	// Create the permission for the API Gateway to invoke the lambda function
	_, err = lambda.NewPermission(ctx, fmt.Sprintf("%s-Permission", name), &lambda.PermissionArgs{
		Action:   pulumi.String("lambda:InvokeFunction"),
		Function: lambdaFunction.Function,
		Principal: pulumi.String("apigateway.amazonaws.com"),
		SourceArn: args.ExecutionArn,
	})
	if err != nil {
		return nil, err
	}

	integration, err := apigatewayv2.NewIntegration(ctx, fmt.Sprintf("%s-Integration", name), &apigatewayv2.IntegrationArgs{
		ApiId:                   args.ApiId,
		IntegrationType:         pulumi.String("AWS_PROXY"),
		ConnectionType:          pulumi.String("INTERNET"),
		IntegrationMethod:       args.Method,
		IntegrationUri:          lambdaFunction.Function.InvokeArn(),
		PassthroughBehavior:     pulumi.String("WHEN_NO_MATCH"),
	})
	if err != nil {
		return nil, err
	}

	// Create the API route
	apiRoute, err := apigatewayv2.NewRoute(ctx, fmt.Sprintf("%s-Route", name), &apigatewayv2.RouteArgs{
		ApiId: args.ApiId,
		AuthorizerId: args.AuthorizerId,
		AuthorizationType: pulumi.String("JWT"),
		RouteKey: pulumi.Sprintf("%s %s", args.Method , args.RoutePath),
		Target: integration.ID().ApplyT(func(id string) (string, error) {
			return fmt.Sprintf("integrations/%v", id), nil
		}).(pulumi.StringOutput),
	});
	if err != nil {
		return nil, err
	}

	component.Name = lambdaFunction.Name
	component.Arn = lambdaFunction.Arn
	component.Role = lambdaFunction.Role
	component.Function = lambdaFunction.Function
	component.Route = apiRoute.ToRouteOutput()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"name": lambdaFunction.Name,
		"arn": lambdaFunction.Arn,
		"role": lambdaFunction.Role,
		"function": lambdaFunction.Function,
		"route": apiRoute,
	}); err != nil {
		return nil, err
	}

	return component, nil
}
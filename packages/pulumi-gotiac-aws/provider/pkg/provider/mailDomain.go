package provider

import (
	"github.com/gothub-team/pulumi-awsworkmail/sdk/go/awsworkmail"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumix"
)

// The set of arguments for creating a MailDomain component resource.
type MailDomainArgs struct {
	// The the path to the .zip for the mailDomain code
	// CodePath pulumi.StringInput `pulumi:"codePath"`
	// // The handler for the mailDomain function
	// HandlerPath pulumi.StringInput `pulumi:"handlerPath"`
	// // The memory size for the mailDomain function
	// MemorySize *pulumi.Int `pulumi:"memorySize"`
	// // The mailDomain runtime
	// Runtime pulumi.StringInput `pulumi:"runtime"`
	// // The array of policy arns that should be attachen to the mailDomain function role
	// PolicyArns pulumi.StringArrayInput `pulumi:"policyArns"`
}

// The MailDomain component resource.
type MailDomain struct {
	pulumi.ResourceState
	// The name of the mailDomain resource
	Random pulumix.Output[string] `pulumi:"random"`
	// // The ARN of the mailDomain resource
	// Arn pulumi.StringOutput `pulumi:"arn"`
	// // The role of the mailDomain resource
	// Role iam.RoleOutput `pulumi:"role"`
	// // The role of the mailDomain resource
	// Function mailDomain.FunctionOutput `pulumi:"function"`
}

// NewMailDomain creates a new MailDomain component resource.
func NewMailDomain(ctx *pulumi.Context,
	name string, args *MailDomainArgs, opts ...pulumi.ResourceOption) (*MailDomain, error) {
	if args == nil {
		args = &MailDomainArgs{}
	}

	component := &MailDomain{}
	err := ctx.RegisterComponentResource("gotiac:index:MailDomain", name, component, opts...)
	if err != nil {
		return nil, err
	}

	random, err := awsworkmail.NewRandom(ctx, "exampleMailDomain", &awsworkmail.RandomArgs{
		Length: pulumi.Int(8),
	})

	if err != nil {
		return nil, err
	}

	component.Random = random.Result

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"random": component.Random,
	}); err != nil {
		return nil, err
	}

	return component, nil
}

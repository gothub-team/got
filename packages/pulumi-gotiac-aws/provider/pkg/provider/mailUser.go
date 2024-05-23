package provider

import (
	"github.com/gothub-team/got/packages/pulumi-gotiac-aws/provider/pkg/util"
	"github.com/gothub-team/pulumi-awsworkmail/sdk/go/awsworkmail"
	"github.com/pulumi/pulumi-random/sdk/v4/go/random"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a MailUser component resource.
type MailUserArgs struct {
	// The region to create the mail domain in
	Region pulumi.StringInput `pulumi:"region"`
	// The display name for the new user.
	DisplayName pulumi.StringInput `pulumi:"displayName"`
	// The name for the new user. WorkMail directory user names have a maximum length
	// of 64. All others have a maximum length of 20.
	Name pulumi.StringInput `pulumi:"name"`
	// The email prefix for the new user. (prefix@domain.com).
	// The default domain of the organization will be appended automatically.
	EmailPrefix pulumi.StringInput `pulumi:"emailPrefix"`
	// Whether the mailbox for the user is enabled.
	Enabled pulumi.BoolInput `pulumi:"enabled"`
	// The identifier of the organization for which the user is created. Either
	// organizationId or domain must be specified.
	OrganizationId *pulumi.StringInput `pulumi:"organizationId,optional"`
	// The mail domain of the organization for which the user is created. Either
	// organizationId or domain must be specified.
	Domain *pulumi.StringInput `pulumi:"domain,optional"`
	// The first name of the new user.
	FirstName *pulumi.StringInput `pulumi:"firstName,optional"`
	// The last name of the new user.
	LastName *pulumi.StringInput `pulumi:"lastName,optional"`
	// The password for the new user.
}

// The MailUser component resource.
type MailUser struct {
	pulumi.ResourceState

	// The ID of the organization that can be used to create mailboxes
	UserId pulumi.StringOutput `pulumi:"userId"`
}

// NewMailUser creates a new MailUser component resource.
func NewMailUser(ctx *pulumi.Context,
	name string, args *MailUserArgs, opts ...pulumi.ResourceOption) (*MailUser, error) {
	if args == nil {
		args = &MailUserArgs{}
	}

	component := &MailUser{}
	err := ctx.RegisterComponentResource("gotiac:index:MailUser", name, component, opts...)
	if err != nil {
		return nil, err
	}

	// Create a random password for the mail  user.
	password, err := random.NewRandomPassword(ctx, name+"Password", &random.RandomPasswordArgs{
		Length:     pulumi.Int(64),
		MinLower:   pulumi.Int(1),
		MinUpper:   pulumi.Int(1),
		MinNumeric: pulumi.Int(1),
		MinSpecial: pulumi.Int(1),
	})
	if err != nil {
		return nil, err
	}

	mailUser, err := awsworkmail.NewUser(ctx, "WorkMailUser", &awsworkmail.UserArgs{
		Region:         args.Region.ToStringOutput(),
		DisplayName:    args.DisplayName.ToStringOutput(),
		Name:           args.Name.ToStringOutput(),
		Password:       password.Result.ToStringPtrOutput(),
		Domain:         util.OptionalStringPtr(args.Domain),
		OrganizationId: util.OptionalStringPtr(args.OrganizationId),
		FirstName:      util.OptionalStringPtr(args.FirstName),
		LastName:       util.OptionalStringPtr(args.LastName),
	})
	if err != nil {
		return nil, err
	}

	args.Enabled.ToBoolOutput().ApplyT(func(enabled bool) error {
		if enabled {
			_, err = awsworkmail.NewWorkmailRegistration(ctx, "WorkMailRegistration", &awsworkmail.WorkmailRegistrationArgs{
				Region:         args.Region.ToStringOutput(),
				OrganizationId: mailUser.OrganizationId,
				EmailPrefix:    args.EmailPrefix.ToStringOutput(),
				EntityId:       mailUser.ID().ToStringOutput(),
			})
		}
		return err
	})

	component.UserId = mailUser.ID().ToStringOutput()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"userId": mailUser.UserId,
	}); err != nil {
		return nil, err
	}

	return component, nil
}

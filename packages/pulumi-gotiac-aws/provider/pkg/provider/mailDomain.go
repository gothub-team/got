package provider

import (
	"fmt"
	"strings"

	"github.com/gothub-team/got/packages/pulumi-gotiac-aws/provider/pkg/util"
	"github.com/gothub-team/pulumi-awsworkmail/sdk/go/awsworkmail"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/route53"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a MailDomain component resource.
type MailDomainArgs struct {
	// The domain to be used for the mailboxes
	Domain pulumi.StringInput `pulumi:"domain"`
}

// The MailDomain component resource.
type MailDomain struct {
	pulumi.ResourceState

	// The ID of the organization that can be used to create mailboxes
	OrganizationId pulumi.StringOutput `pulumi:"organizationId"`
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

	organization, err := awsworkmail.NewOrganization(ctx, "WorkMailOrganization", &awsworkmail.OrganizationArgs{
		Region: pulumi.String("eu-west-1"),
		Alias: args.Domain.ToStringOutput().ApplyT(func(domain string) string {
			return strings.ReplaceAll(domain, ".", "") + "-" + name
		}).(pulumi.StringOutput),
		DomainName:   args.Domain.ToStringOutput(),
		HostedZoneId: util.LookUpHostedZone(ctx, args.Domain),
	})
	if err != nil {
		return nil, err
	}
	organization.Records.ApplyT(func(records []awsworkmail.DnsRecord) error {
		for i, record := range records {
			_, err := route53.NewRecord(ctx, fmt.Sprintf("WorkMailRecord%v", i), &route53.RecordArgs{
				Name: pulumi.String(record.Hostname),
				Type: pulumi.String(record.Type),
				Records: pulumi.StringArray{
					pulumi.String(record.Value),
				},
				ZoneId:         organization.HostedZoneId.ApplyT(func(zoneId string) string { return zoneId }).(pulumi.StringOutput),
				Ttl:            pulumi.Int(300),
				AllowOverwrite: pulumi.Bool(true),
			})
			if err != nil {
				return err
			}
		}
		return nil
	})

	component.OrganizationId = organization.ID().ToStringOutput()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"organizationId": component.OrganizationId,
	}); err != nil {
		return nil, err
	}

	return component, nil
}

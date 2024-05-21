package provider

import (
	"fmt"
	"strings"

	"github.com/gothub-team/got/packages/pulumi-gotiac-aws/provider/pkg/util"
	"github.com/gothub-team/pulumi-awsworkmail/sdk/go/awsworkmail"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/route53"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/ses"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a MailDomain component resource.
type MailDomainArgs struct {
	// The domain to be used for the mailboxes
	Domain pulumi.StringInput `pulumi:"domain"`
	// The region to create the mail domain in
	Region pulumi.StringInput `pulumi:"region"`
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

	// Create an ACM certificate for the domain
	mailRegionProvider, err := aws.NewProvider(ctx, "MailRegionProvider", &aws.ProviderArgs{
		Region: args.Region,
	})
	if err != nil {
		return nil, err
	}

	hostedZoneId := util.LookUpHostedZone(ctx, args.Domain)

	organization, err := awsworkmail.NewOrganization(ctx, "WorkMailOrganization", &awsworkmail.OrganizationArgs{
		Region: args.Region.ToStringOutput(),
		Alias: args.Domain.ToStringOutput().ApplyT(func(domain string) string {
			return strings.ReplaceAll(domain, ".", "") + "-" + name
		}).(pulumi.StringOutput),
		DomainName:   args.Domain.ToStringOutput(),
		HostedZoneId: hostedZoneId,
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

		// Create a new SES MailFrom Validation
		mailFrom, err := ses.NewMailFrom(ctx, "example", &ses.MailFromArgs{
			Domain: args.Domain,
			MailFromDomain: args.Domain.ToStringOutput().ApplyT(func(domain string) (string, error) {
				return fmt.Sprintf("mail.%v", domain), nil
			}).(pulumi.StringOutput),
		}, pulumi.Provider(mailRegionProvider))
		if err != nil {
			return err
		}
		// Example Route53 MX record
		_, err = route53.NewRecord(ctx, "example_ses_domain_mail_from_mx", &route53.RecordArgs{
			ZoneId: hostedZoneId,
			Name:   mailFrom.MailFromDomain,
			Type:   pulumi.String(route53.RecordTypeMX),
			Ttl:    pulumi.Int(600),
			Records: pulumi.StringArray{
				pulumi.Sprintf("10 feedback-smtp.%s.amazonses.com", args.Region),
			},
			AllowOverwrite: pulumi.Bool(true),
		})
		if err != nil {
			return err
		}
		// Example Route53 TXT record for SPF
		_, err = route53.NewRecord(ctx, "example_ses_domain_mail_from_txt", &route53.RecordArgs{
			ZoneId: hostedZoneId,
			Name:   mailFrom.MailFromDomain,
			Type:   pulumi.String(route53.RecordTypeTXT),
			Ttl:    pulumi.Int(600),
			Records: pulumi.StringArray{
				pulumi.String("v=spf1 include:amazonses.com -all"),
			},
			AllowOverwrite: pulumi.Bool(true),
		})
		if err != nil {
			return err
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

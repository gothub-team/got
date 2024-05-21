package util

import (
	"errors"
	"strings"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/route53"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func LookUpHostedZone(ctx *pulumi.Context, domain pulumi.StringInput) pulumi.StringOutput {
	return domain.ToStringOutput().ApplyT(func(_domain string) (string, error) {
		// Split the domain into parts
		parts := strings.Split(_domain, ".")
		// Construct each parent domain starting from the full domain
		for i := range parts {
			// Join parts from i to end
			parentDomain := strings.Join(parts[i:], ".") + "."
			// Look up the hosted zone for the parent domain
			hostedZone, err := route53.LookupZone(ctx, &route53.LookupZoneArgs{
				Name: &parentDomain,
			})
			if err != nil {
				continue
			}
			if hostedZone != nil {
				return hostedZone.Id, nil
			}
		}
		return "", errors.New("no hosted zone found for domain " + _domain)
	}).(pulumi.StringOutput)
}

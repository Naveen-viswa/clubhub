# ClubHub - AWS Free Tier Usage Tracking

**Project Start Date:** November 2, 2025
**Account Creation Date:** [Your AWS account creation date]
**Free Tier Expires:** [12 months from account creation]

## Monthly Usage Limits

| Service | Free Tier Limit | Current Usage | Status |
|---------|----------------|---------------|--------|
| Lambda | 1M requests/month | 0 | ✅ |
| API Gateway | 1M requests/month | 0 | ✅ |
| DynamoDB | 25 RCU/WCU | 0 | ✅ |
| S3 Storage | 5 GB | 0 | ✅ |
| S3 GET Requests | 20,000/month | 0 | ✅ |
| S3 PUT Requests | 2,000/month | 0 | ✅ |
| Cognito | 50K MAU | 0 | ✅ |
| CloudWatch Logs | 5 GB | 0 | ✅ |
| CloudFront | 50 GB transfer | 0 | ✅ |

**Last Updated:** November 2, 2025

## Cost Optimization Rules

1. ✅ Always use provisioned capacity (not on-demand) for DynamoDB
2. ✅ Set CloudWatch log retention to 7 days
3. ✅ Delete unused S3 objects weekly
4. ✅ Stop/delete test resources after use
5. ✅ Use single Cognito User Pool
6. ✅ Compress frontend assets before upload
7. ✅ No NAT Gateway (keep Lambda outside VPC)
8. ✅ No EC2 instances

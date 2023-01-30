import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DeepfryerWebExtensionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // New S3 bucket for the web extension injectable script
    const bucket = new cdk.aws_s3.Bucket(this, 'DeepfryerWebExtensionBucket', {
      bucketName: 'deepfryer-web-extension',
      publicReadAccess: false
    });

    // New DynamoDB table for the web extension injectable script
    const table = new cdk.aws_dynamodb.Table(this, 'DeepfryerWebExtensionTable', {
      tableName: 'deepfryer-web-extension',
      partitionKey: {
        name: 'id',
        type: cdk.aws_dynamodb.AttributeType.STRING
      }
    });
  }
}

import * as cdk from "@aws-cdk/core";
import * as codecommit from "@aws-cdk/aws-codecommit";
import * as amplify from "@aws-cdk/aws-amplify";
import * as ssm from "@aws-cdk/aws-ssm";

export class CdkamplifyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const DOMAIN_NAME = 'figmentresearch.com'
    const PREFIX_NAME = id.toLowerCase().replace('stack', '')
    const SSM_PARAM_NAME = PREFIX_NAME + '-exports-json'

    const repo = new codecommit.Repository(this, "repo", {
      repositoryName: PREFIX_NAME + '-repo',
    });
    
    const param = ssm.StringParameter.fromStringParameterName(this, 'param', SSM_PARAM_NAME)
    
    const app = new amplify.App(this, "app", {
      appName: PREFIX_NAME + '-app',
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
        repository: repo,
      }),
      environmentVariables: {
        SSM_PARAMETER_NAME: SSM_PARAM_NAME,
      }
    });
    
    param.grantRead(app);
    
    const masterBranch = app.addBranch("master");

    const domain = new amplify.Domain(this, "domain", {
      app: app,
      domainName: DOMAIN_NAME,
      subDomains: [
        {
          branch: masterBranch,
          prefix: PREFIX_NAME,
        },
      ],
    });

    app.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);
  }
}

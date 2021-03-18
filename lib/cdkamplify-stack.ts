import * as cdk from "@aws-cdk/core";
import * as codecommit from "@aws-cdk/aws-codecommit";
import * as amplify from "@aws-cdk/aws-amplify";
import * as iam from "@aws-cdk/aws-iam";

export class CdkamplifyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const DOMAIN_NAME = 'figmentresearch.com'
    const PREFIX_NAME = id.toLowerCase().replace('stack', '')

    const repo = new codecommit.Repository(this, "repo", {
      repositoryName: PREFIX_NAME + '-repo',
    });
    
    const role = new iam.Role(this, "role", {
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
      roleName: PREFIX_NAME + '-role',
    });
    
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess-Amplify")
    );

    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess")
    );

    const app = new amplify.App(this, "cdkamp_ampapp", {
      appName: PREFIX_NAME + '-app',
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
        repository: repo,
      }),
      environmentVariables: {
        SSM_PARAMETER_NAME: `${PREFIX_NAME}-exports-json`,
      },
      // role: role
    });
    
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

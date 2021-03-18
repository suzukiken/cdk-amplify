#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkamplifyStack } from '../lib/cdkamplify-stack';

const app = new cdk.App();
new CdkamplifyStack(app, 'CdkamplifyStack');

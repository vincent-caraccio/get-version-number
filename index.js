'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('token');
  const owner = core.getInput('owner');
  const repo = core.getInput('repo');
  const octokit = github.getOctokit(token);
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/artifacts',
    { owner, repo }
  );
  console.log(`res: ${JSON.stringify(res, null, 2)}`);

  core.exportVariable('RELEASE_VERSION', '0.0.0');
} catch (error) {
  core.setFailed(error.message);
}

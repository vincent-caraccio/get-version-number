'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

(async function () {
  try {
    const token = core.getInput('token');
    const repository = core.getInput('repository');
    const [owner, repo] = repository.split('/');
    const major = core.getInput('major');
    const minor = core.getInput('minor');
    const patch = core.getInput('patch');
    const octokit = github.getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', { owner, repo });
    const tag = data ? data.tag_name : '';
    if (tag && tag.match(/\d+\.\d+\.\d+/)) {
      const lastVersion = tag.split('.').map(t => parseInt(t));
      const nextVersion = [
        major || lastVersion[0],
        minor || lastVersion[1],
        patch || lastVersion[2] + 1,
      ];
      core.exportVariable('RELEASE_VERSION', nextVersion.join('.'));
    } else {
      core.exportVariable('RELEASE_VERSION', '0.0.1');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})().catch(error => core.setFailed(error.message));

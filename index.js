'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

(async function () {
  const major = core.getInput('major');
  const minor = core.getInput('minor');
  const patch = core.getInput('patch');
  const nextVersion = [major || 0, minor || 0, patch || 1];

  try {
    const token = core.getInput('token');
    const repository = core.getInput('repository');
    const [owner, repo] = repository.split('/');
    const octokit = github.getOctokit(token);
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', { owner, repo });
    const tag = data ? data.tag_name : '';
    if (tag && tag.match(/\d+\.\d+\.\d+/)) {
      const lastVersion = tag.split('.').map(t => parseInt(t));
      nextVersion[0] = major || lastVersion[0];
      nextVersion[1] = major || lastVersion[1];
      nextVersion[2] = major || lastVersion[2];
    }
    core.exportVariable('RELEASE_VERSION', nextVersion.join('.'));
  } catch (error) {
    if (error.message === 'Not Found') {
      core.exportVariable('RELEASE_VERSION', nextVersion.join('.'));
    } else {
      core.setFailed(error.message);
    }
  }
})().catch(error => core.setFailed(error.message));

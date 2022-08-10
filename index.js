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
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/releases', { owner, repo });
    const sortedVersions = data
      .map(r => (r.tag_name.match(/\d+\.\d+\.\d+/) || [])[0])
      .filter(v => !!v)
      .map(v => v.split('.').map(t => parseInt(t)))
      .sort((a, b) =>
        a[0] === b[0] ?
          a[1] === b[1] ?
            a[2] - b[2] :
            a[1] - b[1] :
          a[0] - b[0]);
    if (sortedVersions.length > 0) {
      const lastVersion = sortedVersions[sortedVersions.length - 1];
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

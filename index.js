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
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/releases', { owner, repo });
    const lastVersion = getLatestTag(data);
    if (lastVersion) {
      const isNewMajor = major && lastVersion[0] && major > lastVersion[0];
      const isNewMinor = minor && lastVersion[1] && minor > lastVersion[1];
      nextVersion[0] = major || lastVersion[0];
      nextVersion[1] = isNewMajor ? 0 : (minor || lastVersion[1]);
      nextVersion[2] = isNewMajor || isNewMinor ? 0 : (patch || lastVersion[2] + 1);
    }
    exportVersionToEnv(nextVersion);
  } catch (error) {
    if (error.message === 'Not Found') {
      exportVersionToEnv(nextVersion);
    } else {
      core.setFailed(error.message);
    }
  }
})().catch(error => core.setFailed(error.message));

function getLatestTag(releases = []) {
  const sortedVersions = releases
    .map(r => (r.tag_name.match(/\d+\.\d+\.\d+/) || [])[0])
    .filter(v => !!v)
    .map(v => v.split('.').map(t => parseInt(t)))
    .sort((a, b) =>
      a[0] === b[0] ?
        a[1] === b[1] ?
          a[2] - b[2] :
          a[1] - b[1] :
        a[0] - b[0]);
  return sortedVersions.length ? sortedVersions[sortedVersions.length - 1] : undefined;
}

function exportVersionToEnv(nextVersion) {
  const version = nextVersion.join('.');
  core.exportVariable('RELEASE_VERSION', version);
  console.log(`Exporting environment variable RELEASE_VERSION=${version}`);
}

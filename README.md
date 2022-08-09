# Get version number

This action extracts the version of the latest release and increments it.
Result is stored in a environment variable named RELEASE_VERSION.

## Inputs

## `token`

**Required** The github token to query the list of artifacts.

## `owner`

**Required** The repository owner to get the artifacts from.

## `repo`

**Required** The repository name to get the artifacts from.

## `major`

Override for the major version

## `minor`

Override for the minor version

## `patch`

Override for the patch version

## Example usage

```
uses: vincent-caraccio/get-version-number@v0.0.1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  owner: my-organization
  repo: my-repository
```

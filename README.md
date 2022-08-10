# Get version number

This action extracts the version of the latest release and increments it.
Result is stored in a environment variable named RELEASE_VERSION.

## Inputs

## `token`

**Required** The github token to query the list of artifacts.

## `repository`

**Required** The repository (format is usually my-organisation/my-repository).

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
  token: ${{ secrets.TOKEN }} # token should have read access to releases
  repository: ${{ github.repository }}
```

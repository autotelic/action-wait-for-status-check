<p align="center">
  <a href="https://github.com/autotelic/action-wait-for-status-check/actions"><img alt="action-wait-for-status-check status" src="https://github.com/autotelic/action-wait-for-status-check/workflows/build-test/badge.svg"></a>
</p>

# Github Action: Wait for Status Check

A Github Action that allows you to wait for a Commit status to complete before continuing with a workflow.

A commit status check can take one of two forms; either a "check run" using the Github Checks API or a "commit status". 

See [Types of Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks#types-of-status-checks-on-github)

This action retrieves Commit status checks only using the [GitHub Repository API](https://docs.github.com/en/rest/reference/commits#get-the-combined-status-for-a-specific-reference).

## Example Usage

```yaml
    steps:
      - uses: autotelic/action-wait-for-status-check@v1
        id: wait-for-status
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          statusName: "An Expected Commit Status Context"

      - name: Do something with a passing status
        if: steps.wait-for-status.outputs.state == 'success'

      - name: Do something with a failing status
        if: steps.wait-for-status.outputs.state == 'failure'
  
      - name: Echo Outputs
        run: |
         echo ${{ steps.wait-for-status.outputs.context }}
         echo ${{ steps.wait-for-status.outputs.state }}
         echo ${{ steps.wait-for-status.outputs.description }}
         echo ${{ steps.wait-for-status.outputs.target_url }}  
```

## Inputs

This action accepts the following parameters as inputs using the `with` keyword.

### token

- **Required**

- The GitHub token to use for making API requests. Typically, this would be set to `${{ secrets.GITHUB_TOKEN }}`.

### statusName

- **Required**

- The name of the GitHub status check to wait for. For example, `build` or `deploy`.

### ref

- **Optional**

- The Git ref of the commit you want to poll for a passing status check.

- **Default context source: `github.sha`** 

- Note: If the action is used in a Workflow triggered by a `pull_request` event, the `github.pull_request.head.sha` context property will be used instead.

### repo

- **Optional**

- The name of the GitHub repository you want to poll for a passing status check.

- **Default context source: `github.repo.repo`** 

### owner

- **Optional**

- The owner of the GitHub repository you want to poll for a passing status check.

- **Default context source: `github.repo.owner`** 

### timeoutSeconds

- **Optional**

- The number of seconds to wait for the status check to complete.

- **default: "600"**

### intervalSeconds

- **Optional**

- The number of seconds to wait before each poll of the GitHub API.

- **default: "10"**

## Outputs

This action will output the details from the matching commit status when it is found.

All available details are listed in the GitHub API documentation [here](https://docs.github.com/en/rest/reference/commits#get-the-combined-status-for-a-specific-reference).
### state

- Possible commit status states are `error`, `failure`, `pending`, or `success`. Additionally, the state output can return `timed_out` if the commit status was not found within the configured `timeoutSeconds`.

### context

- The context or "name" of the commit status found. This should exactly match the `statusName` input parameter supplied.

### description

- The description attached to the commit status found.

### target_url

- The target_url attached to the commit status found.

## Development

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
...
```

## Action Versioning and Releases

Action versioning workflow is based on recommendations from the Github Actions Toolkit

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

### Minor/Patch versions

On branch `main`:

- Increment Package version and push tags
  ```sh
    $ npm version [minor/patch]
    $ git push origin v1.1.3
  ```
- Create a GitHub release for each specific version
- Publish the specific version to the marketplace
- **Move** Current major version tag to new minor/patch version commit
  ```sh
    $ git tag -fa v1 -m "Update v1 tag"
    $ git push origin v1 --force
  ```

### Major Versions
On branch `main`:

- Increment Package version and push tags
  ```sh
    $ npm version major
    $ git push origin v2.0.0
  ```
- Create a GitHub release for each specific version
- Publish the specific version to the marketplace
- **Create** a new major version tag on the same commit
  ```sh
    $ git tag -a v2 -m "Create v2 Major tag"
    $ git push origin v2
  ```

### Adding Patches to prior Major Versions

- Checkout the prior major version to a new release branch
  ```sh
    $ git checkout -b releases/v1 v1
    Switched to a new branch 'releases/v1'
  ```
- Make necessary patch changes and push the new releases branch to the remote
- Increment Package version and push tags
  ```sh
    $ npm version [minor/patch]
    $ git push origin v1.1.4
  ```
- Create a GitHub release for each specific version
- Publish the specific version to the marketplace
- **Move** prior major version tag to the new minor/patch version commit
  ```sh
    $ git tag -fa v1 -m "Update v1 tag"
    $ git push origin v1 --force
  ```

<p align="center">
  <a href="https://github.com/autotelic/action-wait-for-status-check/actions"><img alt="action-wait-for-status-check status" src="https://github.com/autotelic/action-wait-for-status-check/workflows/build-test/badge.svg"></a>
</p>

# Github Action: Wait for Status Check

A Github Action that allows you to wait for a Commit status to complete before continuing with a workflow.

A commit status check can take one of two forms either a "check run" using the Github Checks API or a "commit status". 

See [Types of Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks#types-of-status-checks-on-github)

This action retrieves Commit status checks only using the [GitHub Repository API](https://docs.github.com/en/rest/reference/commits#get-the-combined-status-for-a-specific-reference).

## Example Usage

```yaml
    steps:
      - uses: autotelic/action-wait-for-status-check@feat/initial-implementation
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

**Required**

The GitHub token to use for making API requests. Typically, this would be set to ${{ secrets.GITHUB_TOKEN }}.

### statusName

***Required**

The name of the GitHub status check to wait for. For example, `build` or `deploy`.

### ref

***Optional**

The Git ref of the commit you want to poll for a passing status check.

**Default context source: `github.sha`** 

Note: If working with a Pull Request Event, you may want to use the `github.pull_request.head.sha` context property instead.

### repo

***Optional**

The name of the GitHub repository you want to poll for a passing status check.

**Default context source: `github.repo.repo`** 

### owner

***Optional**

The owner of the GitHub repository you want to poll for a passing status check.

**Default context source: `github.repo.owner`** 

### timeoutSeconds

***Optional**

The number of seconds to wait for the status check to complete.

**default: "600"**

### intervalSeconds

***Optional**

The number of seconds to wait before each poll of the GitHub API.

**default: "10"**

## Outputs

This action will output the details from the matching commit status when it is found.

All available details are listed in the GitHub API documentation [here](https://docs.github.com/en/rest/reference/commits#get-the-combined-status-for-a-specific-reference).
### state

Possible commit status states are `error`, `failure`, `pending`, or `success`. Additionally, the state output can return `timed_out` if the commit status was not found within the configured `timeoutSeconds`.

### context

The context or "name" of the commit status found. This should exactly match the `statusName` input parameter supplied.

### description

The description attached to the commit status found.

### target_url

The target_url attached to the commit status found.

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

## Publish to a distribution branch

TODO

Actions are run from GitHub repos so the `/dist` folder must be checked in.

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

<p align="center">
  <a href="https://github.com/autotelic/action-wait-for-status-check/actions"><img alt="action-wait-for-status-check status" src="https://github.com/autotelic/action-wait-for-status-check/workflows/build-test/badge.svg"></a>
</p>

# Github Action: Wait for Status Check

A Github Action that allows you to wait for a Commit status to complete before continuing with a workflow.
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
         echo ${{ steps.wait-for-status.outputs.state }}
         echo ${{ steps.wait-for-status.outputs.description }}
         echo ${{ steps.wait-for-status.outputs.target_url }}  
```

## Inputs


## Outputs

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

Actions are run from GitHub repos so we will checkin the packed dist folder. 

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

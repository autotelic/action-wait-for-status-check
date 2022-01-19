import {resolveSha} from '../src/resolve-sha'
import {expect, test} from '@jest/globals'

import {Context} from '@actions/github/lib/context'

type RecursivePartial<T> = {[P in keyof T]?: T[P] | RecursivePartial<T[P]>}

test('returns context.sha for non pull_request events', async () => {
  const testContext: RecursivePartial<Context> = {
    eventName: 'push',
    sha: '123456789abcdefg',
    payload: {
      pull_request: {
        head: {
          sha: 'gfedcba987654321'
        }
      }
    }
  }

  await expect(resolveSha(testContext as Context)).toEqual(testContext.sha)
})

test('returns context.payload.pull_request.head.sha for pull_request events', async () => {
  const testContext: RecursivePartial<Context> = {
    eventName: 'pull_request',
    sha: '123456789abcdefg',
    payload: {
      pull_request: {
        head: {
          sha: 'gfedcba987654321'
        }
      }
    }
  }

  await expect(resolveSha(testContext as Context)).toEqual(
    testContext.payload?.pull_request?.head?.sha
  )
})

test('returns context.sha if the pull request sha is undefined', async () => {
  const testContext: RecursivePartial<Context> = {
    eventName: 'pull_request',
    sha: '123456789abcdefg',
    payload: {}
  }

  await expect(resolveSha(testContext as Context)).toEqual(testContext.sha)
})

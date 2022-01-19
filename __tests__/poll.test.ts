import {poll} from '../src/poll'
import {jest, expect, test} from '@jest/globals'

const client = {
  rest: {
    repos: {
      getCombinedStatusForRef: jest.fn<ReturnType<any>, Parameters<any>>()
    }
  }
}

// jest.fn<ReturnType<typeof add>, Parameters<typeof add>>()

const run = () =>
  poll({
    client: client as any,
    log: () => {},
    statusName: 'testContext',
    owner: 'testOrg',
    repo: 'testRepo',
    ref: '123456789abcdefg',
    timeoutSeconds: 3,
    intervalSeconds: 0.1
  })

test('Returns details of a matching status check', async () => {
  client.rest.repos.getCombinedStatusForRef.mockResolvedValue({
    data: {
      statuses: [
        {
          state: 'success',
          description: 'Build has completed successfully',
          target_url: 'https://ci.example.com/1000/output',
          context: 'testContext'
        }
      ]
    }
  })

  const result = await run()

  expect(result).toEqual({
    context: 'testContext',
    description: 'Build has completed successfully',
    state: 'success',
    target_url: 'https://ci.example.com/1000/output'
  })
  expect(client.rest.repos.getCombinedStatusForRef).toHaveBeenCalledWith({
    owner: 'testOrg',
    repo: 'testRepo',
    ref: '123456789abcdefg'
  })
})

test('polls until matching check is found', async () => {
  client.rest.repos.getCombinedStatusForRef
    .mockResolvedValueOnce({
      data: {
        statuses: [
          {
            state: 'pending',
            description: 'Starting Other Context',
            target_url: 'https://ci.example.com/1000/output',
            context: 'other Context'
          }
        ]
      }
    })
    .mockResolvedValueOnce({
      data: {
        statuses: [
          {
            state: 'success',
            description: 'Other Context has completed successfully',
            target_url: 'https://ci.example.com/1000/output',
            context: 'other Context'
          }
        ]
      }
    })
    .mockResolvedValueOnce({
      data: {
        statuses: [
          {
            state: 'success',
            description: 'Other Context has completed successfully',
            target_url: 'https://ci.example.com/1000/output',
            context: 'other Context'
          },
          {
            state: 'success',
            description: 'Build has completed successfully',
            target_url: 'https://ci.example.com/3000/output',
            context: 'testContext'
          }
        ]
      }
    })

  const result = await run()

  expect(result).toEqual({
    context: 'testContext',
    description: 'Build has completed successfully',
    state: 'success',
    target_url: 'https://ci.example.com/3000/output'
  })
  expect(client.rest.repos.getCombinedStatusForRef).toHaveBeenCalledTimes(3)
})

test(`returns a state of 'timed_out' if a matching status check is not found by the timeoutSeconds`, async () => {
  client.rest.repos.getCombinedStatusForRef.mockResolvedValue({
    data: {
      statuses: [
        {
          state: 'success',
          description: 'Other Context has completed successfully',
          target_url: 'https://ci.example.com/1000/output',
          context: 'other Context'
        }
      ]
    }
  })

  const result = await run()
  expect(result).toEqual({state: 'timed_out'})
})

import {GitHub} from '@actions/github/lib/utils'
import {wait} from './wait'

export interface Options {
  client: InstanceType<typeof GitHub>
  log: (message: string) => void

  statusName: string
  timeoutSeconds: number
  intervalSeconds: number
  owner: string
  repo: string
  ref: string
}

interface CommitStatusValues {
  state?: string
  description?: string
  target_url?: string
}

export const poll = async (options: Options): Promise<CommitStatusValues> => {
  const {
    client,
    log,
    statusName,
    timeoutSeconds,
    intervalSeconds,
    owner,
    repo,
    ref
  } = options

  let now = new Date().getTime()
  const deadline = now + timeoutSeconds * 1000

  while (now <= deadline) {
    log(`Retrieving commit statuses on ${owner}/${repo}@${ref}...`)

    const statuses = await client.rest.repos.listCommitStatusesForRef({
      owner,
      repo,
      ref
    })

    log(`Retrieved ${statuses.data.length} commit statuses`)

    const completedCommitStatus = statuses.data.find(
      commitStatus =>
        commitStatus.context === statusName && commitStatus.state !== 'pending'
    )
    if (completedCommitStatus) {
      log(
        `Found a completed commit status with id ${completedCommitStatus.id} and conclusion ${completedCommitStatus.state}`
      )
      return {
        state: completedCommitStatus.state,
        description: completedCommitStatus.description,
        target_url: completedCommitStatus.target_url
      }
    }

    log(
      `No completed commit status named ${statusName}, waiting for ${intervalSeconds} seconds...`
    )
    await wait(intervalSeconds * 1000)

    now = new Date().getTime()
  }

  log(
    `No completed commit status named ${statusName} after ${timeoutSeconds} seconds, exiting with conclusion 'timed_out'`
  )
  return {
    state: 'timed_out'
  }
}

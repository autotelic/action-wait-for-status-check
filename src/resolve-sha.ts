import {Context} from '@actions/github/lib/context'

export const resolveSha = (context: Context): string => {
  return context.eventName === 'pull_request'
    ? context.payload.pull_request?.head.sha || context.sha
    : context.sha
}

import Context from '@actions/github/lib/context'

export const resolveSha = (context: Context.Context): string => {
  let sha = context.sha

  if (context.eventName === 'pull_request') {
    sha = context?.payload?.pull_request?.head?.sha
  }

  return sha
}

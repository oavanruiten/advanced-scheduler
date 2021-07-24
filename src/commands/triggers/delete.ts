import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {HTTP} from 'http-call'
const cli: any = require('heroku-cli-util')
import ux from 'cli-ux'
import color from '@heroku-cli/color'

export default class TriggersDelete extends Command {
  static usage = 'triggers:delete <uuid>...'

  static description = 'Permanently delete an Advanced Scheduler trigger for an app'

  static examples = [
    '$ heroku triggers:delete 01234567-89ab-cdef-0123-456789abcdef -a example',
  ]

  static args = [
    {
      name: 'uuid',
      required: true,
      description: 'uuid of the Advanced Scheduler trigger',
    }
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    app: flags.app({required: true}),
  }

  async run() {
    const {args, flags} = this.parse(TriggersDelete)

    const {body: config} = await this.heroku.get<Heroku.ConfigVars>(`/apps/${flags.app}/config-vars`)

    const token = config['ADVANCED_SCHEDULER_API_TOKEN']

    if (!token)
      this.error('Config var ADVANCED_SCHEDULER_API_TOKEN not set, make sure to generate an API token through the Advanced Scheduler Dashboard.', {exit: 101})

    ux.action.start(`Deleting ${cli.color.hex('#af6eff')('Advanced Scheduler')} trigger`)

    try {
      const {body} = await HTTP.delete<{message: string, code: string}>(`https://api.advancedscheduler.io/triggers/${args.uuid}`, {headers: {authorization: `Bearer ${token}`}})

      ux.action.stop(`${color.green('done')}, deleted trigger with uuid ${color.hex('#ff93ff')(args.uuid)}`)
    } catch (error) {
      const message = error.body && error.body.message ? error.body.message : error.message

      switch (message) {
        case 'Unauthorized.':
          this.error(message, { exit: 102 })
          break
        case 'Forbidden.':
          this.error(message, { exit: 103 })
          break
        case 'Trigger not found.':
          this.error(message, { exit: 105 })
          break
        case 'Server Error.':
          this.error(message, { exit: 106 })
          break
        default:
          this.error(message, { exit: 199 })
      }
    }
  }
}

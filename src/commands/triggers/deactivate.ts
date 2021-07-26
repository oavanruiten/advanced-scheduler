import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {HTTP} from 'http-call'
const cli: any = require('heroku-cli-util')
import ux from 'cli-ux'
import color from '@heroku-cli/color'

import { Trigger, Dyno, FrequencyType, State } from '../../misc'

export default class TriggersDeactivate extends Command {
  static usage = 'triggers:deactivate <uuid>...'

  static description = 'Deactivate an Advanced Scheduler trigger for an app'

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
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const {args, flags} = this.parse(TriggersDeactivate)

    const {body: config} = await this.heroku.get<Heroku.ConfigVars>(`/apps/${flags.app}/config-vars`)

    const token = config['ADVANCED_SCHEDULER_API_TOKEN']

    if (!token)
      this.error('Config var ADVANCED_SCHEDULER_API_TOKEN not set, make sure to generate an API token through the Advanced Scheduler Dashboard.', {exit: 101})

    ux.action.start(`Deactivating ${cli.color.hex('#af6eff')('Advanced Scheduler')} trigger`)

    try {
      const { body: { trigger } } = await HTTP.get<{message: string, code: string, trigger: Trigger}>(`https://api.advancedscheduler.io/triggers/${args.uuid}`, {headers: {authorization: `Bearer ${token}`}})

      if (!flags.force) {
        if (trigger.state === State.INACTIVE) {
          this.error(`Trigger is already inactive`, { exit: 121 })
        }
      }

      const options = {
        headers: {authorization: `Bearer ${token}`},
        body: { ...trigger, state: State.INACTIVE },
      }

      const {body} = await HTTP.put<{message: string, code: string, trigger: Trigger}>(`https://api.advancedscheduler.io/triggers/${args.uuid}`, options)

      ux.action.stop(`${color.green('done')}, deactivated trigger with uuid ${color.hex('#ff93ff')(args.uuid)}`)
    } catch (error) {
      ux.action.stop(color.red('!'))

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

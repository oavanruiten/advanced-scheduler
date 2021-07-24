import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {HTTP} from 'http-call'
const cli: any = require('heroku-cli-util')
import ux from 'cli-ux'
import cronstrue from 'cronstrue'

import { Trigger } from '../misc'

export default class Triggers extends Command {
  static usage = 'triggers...'

  static description = 'List the Advanced Scheduler triggers for an app'

  static examples = [
    '$ heroku triggers -a example',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    app: flags.app({required: true}),
    json: flags.boolean({char: 'j', description: 'output triggers in json format'}),
  }

  async run() {
    const {args, flags} = this.parse(Triggers)

    const {body: config} = await this.heroku.get<Heroku.ConfigVars>(`/apps/${flags.app}/config-vars`)

    const token = config['ADVANCED_SCHEDULER_API_TOKEN']

    if (!token)
      this.error('Config var ADVANCED_SCHEDULER_API_TOKEN not set, make sure to generate an API token through the Advanced Scheduler Dashboard.', {exit: 101})

    try {
      const {body} = await HTTP.get<{message: string, code: string, triggers: Trigger[]}>('https://api.advancedscheduler.io/triggers', {headers: {authorization: `Bearer ${token}`}})
      if (body.triggers.length > 0) {
        if (flags.json) {
          ux.styledJSON(body.triggers)
        } else {
          //cli.styledHeader(`Triggers for app ${flags.app}\n`)
          cli.log()
          for (let trigger of body.triggers) {
            let stateColor = 'gray'
            switch (trigger.state) {
              case 'active':
                stateColor = 'green'
                break
              case 'inactive':
                stateColor = 'gray'
                break
              case 'completed':
                stateColor = 'cyan'
                break
            }
            cli.log(`=== ${cli.color.hex('#ff93ff')(trigger.uuid)} (${cli.color[stateColor](trigger.state)}): ${trigger.name}`)
            let schedule
            if (trigger.frequencyType === 'recurring') { // todo define as enum
              schedule = cronstrue.toString(trigger.schedule, { verbose: true })
            } else {
              schedule = `At ${trigger.schedule}`
            }
            cli.log(`${cli.color.hex('#af6eff')(schedule)} ${cli.color.hex('#af6eff')(trigger.timezone)} w/ ${cli.color.hex('#57448e')(trigger.dyno + ' ⬢ ')}`)
            cli.log(`$ ${trigger.value} \n`)
          }
        }
      } else {
        this.log(body.message)
      }
    } catch (error) {
      const message = error.body && error.body.message ? error.body.message : error.message
      switch (message) {
        case 'Unauthorized.':
          this.error(message, { exit: 102 })
          break
        case 'Forbidden.':
          this.error(message, { exit: 103 })
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


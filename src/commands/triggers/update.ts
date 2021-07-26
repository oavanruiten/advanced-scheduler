import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {HTTP} from 'http-call'
const cli: any = require('heroku-cli-util')
import ux from 'cli-ux'
import color from '@heroku-cli/color'
import * as moment from 'moment-timezone'
import * as parser from 'cron-parser'

import { Trigger, Dyno, FrequencyType, State } from '../../misc'

export default class TriggersUpdate extends Command {
  static usage = 'triggers:update <uuid>...'

  static description = 'Update an Advanced Scheduler trigger for an app'

  static examples = [
    '$ heroku triggers:update 01234567-89ab-cdef-0123-456789abcdef -a example --name "Trigger updated via CLI" --frequencyType recurring  --schedule "* * * * *" --value "npm run something-else" --dyno Free',
    '$ heroku triggers:update 01234567-89ab-cdef-0123-456789abcdef -a example --name "Trigger updated via CLI" --frequencyType one-off  --schedule "2025-12-25 00:00:00" --value "npm run something-else" --dyno Free',
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
    name: flags.string({
      description: 'name of trigger',
      required: false
    }),
    frequencyType: flags.string({
      description: 'frequency of trigger execution',
      required: false,
      options: [ FrequencyType.RECURRING, FrequencyType.ONE_OFF ]
    }),
    schedule: flags.string({
      description: 'schedule of trigger execution',
      required: false,
      dependsOn: ['frequencyType', 'timezone']
    }),
    value: flags.string({
      description: 'command of trigger',
      required: false,
    }),
    timezone: flags.string({
      description: 'timezone of trigger',
      required: false,
    }),
    state: flags.string({
      description: 'state of trigger',
      required: false,
      options: [ State.ACTIVE, State.INACTIVE ],
    }),
    dyno: flags.string({
      description: 'dyno for task execution',
      required: false,
      options: [
        Dyno.FREE,
        Dyno.HOBBY,
        Dyno.STANDARD_1X,
        Dyno.STANDARD_2X,
        Dyno.PERFORMANCE_M,
        Dyno.PERFORMANCE_L,
        Dyno.PRIVATE_S,
        Dyno.PRIVATE_M,
        Dyno.PRIVATE_L,
      ]
    }),
    timeout: flags.integer({
      description: 'timeout of task execution',
      required: false,
      dependsOn: ['dyno']
    }),
  }

  async run() {
    const {args, flags} = this.parse(TriggersUpdate)

    if (flags.name && flags.name.length > 150) {
      this.error(`Expected --name=${flags.name.substring(0, 12) + '...'} to be shorter than 150 characters\nSee more help with --help`, { exit: 110 })
    }
    if (flags.value && flags.value.length > 1000) {
      this.error(`Expected --value=${flags.value.substring(0, 12) + '...'} to be shorter than 1000 characters\nSee more help with --help`, { exit: 111 })
    }
    if (flags.timezone && moment.tz.zone(flags.timezone) === null) {
      this.error(`Expected --timezone=${flags.timezone} to be a valid timezone\nSee more help with --help`, { exit: 110 })
    }
    if (flags.frequencyType && flags.schedule && flags.timezone) {
      if (flags.frequencyType === FrequencyType.RECURRING) {
        try {
          parser.parseExpression(flags.schedule)

          const parts = flags.schedule.split(" ")
          parts.map((part) => {
            const match = /^\d{1,2}\/\d{1,2}$/.test(part)
            if (match) throw new Error("Invalid cron expression: using specific, non-range values together with a step modifier")
          })
        } catch (error) {
          this.error(`Expected --schedule=${flags.schedule} to be a valid cron expression\nSee more help with --help`, { exit: 112 })
        }
        if (flags.schedule.trim().split(' ').length > 5) {
          this.error(`Expected --schedule=${flags.schedule} to be a cron expression with an interval of at least 1 minute\nSee more help with --help`, { exit: 113 })
        }
      }
      if (flags.frequencyType === FrequencyType.ONE_OFF) {
        if (!/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(flags.schedule)) {
          this.error(`Expected --schedule=${flags.schedule} to be of format YYYY-MM-DD hh:mm:ss\nSee more help with --help`, { exit: 113 })
        }
        if (!/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(flags.schedule)) {
          this.error(`Expected --schedule=${flags.schedule} to be a valid date\nSee more help with --help`, { exit: 114 })
        }
        const schedule = moment.tz(flags.schedule, flags.timezone)
        const now = moment.tz(flags.timezone)
        if (schedule < now) {
          this.error(`Expected --schedule=${flags.schedule} to be in the future\nSee more help with --help`, { exit: 115 })
        }
      }
    }
    if (flags.dyno && flags.timeout) {
      if (flags.dyno === Dyno.PRIVATE_S
          || flags.dyno === Dyno.PRIVATE_M
          || flags.dyno === Dyno.PRIVATE_L) {
        if (flags.timeout < 240 || flags.timeout > 86400) {
          this.error(`Expected --timeout=${flags.timeout} to be between 240 and 86400\nSee more help with --help`, { exit: 116 })
        }
      } else {
        if (flags.timeout < 60 || flags.timeout > 86400) {
          this.error(`Expected --timeout=${flags.timeout} to be between 60 and 86400\nSee more help with --help`, { exit: 117 })
        }
      }
    }

    const {body: config} = await this.heroku.get<Heroku.ConfigVars>(`/apps/${flags.app}/config-vars`)
    const token = config['ADVANCED_SCHEDULER_API_TOKEN']
    if (!token)
      this.error('Config var ADVANCED_SCHEDULER_API_TOKEN not set, make sure to generate an API token through the Advanced Scheduler Dashboard.', {exit: 101})

    ux.action.start(`Updating ${cli.color.hex('#af6eff')('Advanced Scheduler')} trigger`)

    const { body: { trigger } } = await HTTP.get<{message: string, code: string, trigger: Trigger}>(`https://api.advancedscheduler.io/triggers/${args.uuid}`, {headers: {authorization: `Bearer ${token}`}})

    if (flags.name) trigger.name = flags.name;
    if (flags.frequencyType) trigger.frequencyType = (flags.frequencyType as FrequencyType);
    if (flags.schedule) trigger.schedule = flags.schedule;
    if (flags.value) trigger.value = flags.value;
    if (flags.timezone) trigger.timezone = flags.timezone;
    if (flags.state) trigger.state = (flags.state as State);
    if (flags.dyno) trigger.dyno = (flags.dyno as Dyno);
    if (flags.timeout) trigger.timeout = flags.timeout;

    if (trigger.frequencyType === FrequencyType.ONE_OFF) {
      const schedule = moment.tz(trigger.schedule, trigger.timezone)
      const now = moment.tz(trigger.timezone)
      if (schedule < now) {
        throw new Error(`Expected --schedule=${trigger.schedule} to be in the future\nSee more help with --help`)
      }
    }

    const options = {
      headers: {authorization: `Bearer ${token}`},
      body: { ...trigger },
    }

    const {body} = await HTTP.put<{message: string, code: string, trigger: Trigger}>(`https://api.advancedscheduler.io/triggers/${args.uuid}`, options)

    ux.action.stop(`${color.green('done')}, updated trigger ${color.hex('#ff93ff')(body.trigger.uuid)}`)
  }

  async catch(error: any) {
    const message = error.body && error.body.message ? error.body.message : error.message

    switch (message) {
      case 'Unauthorized.':
        this.error(message, { exit: 102 })
        break
      case 'Forbidden.':
        this.error(message, { exit: 103 })
        break
      case 'Error during validation.':
        this.error(message, { exit: 104 })
        break
      case 'Server Error.':
        this.error(message, { exit: 106 })
        break
      default:
        this.error(message, { exit: 199 })
    }
  }
}

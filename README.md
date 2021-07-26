advanced-scheduler
==================

CLI to interact with the [Advanced Scheduler Heroku Add-on](https://elements.heroku.com/addons/advanced-scheduler). The Advanced Scheduler Command Line Interface extends the [Service API](documentation.advancedscheduler.io) and makes it easy for you to create and manage your triggers directly from the terminal. 

Advanced Scheduler is the next standard in task scheduling on Heroku applications. Get more flexibility, out-of-the-box monitoring, greater reliability and unparalleled ease of use on top of the well-known Heroku Scheduler experience. Learn more [here](https://devcenter.heroku.com/articles/advanced-scheduler).

The Advanced Scheduler Heroku CLI plugin is currently in open beta. Any feedback is welcome at support@advancedscheduler.io.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/advanced-scheduler.svg)](https://npmjs.org/package/advanced-scheduler)
[![Downloads/week](https://img.shields.io/npm/dw/advanced-scheduler.svg)](https://npmjs.org/package/advanced-scheduler)
[![License](https://img.shields.io/npm/l/advanced-scheduler.svg)](https://github.com/oavanruiten/advanced-scheduler/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ heroku plugins:install advanced-scheduler
$ heroku COMMAND
running command...
$ heroku triggers --help [COMMAND]
USAGE
  $ heroku triggers
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`heroku triggers...`](#heroku-triggers)
* [`heroku triggers:activate <uuid>...`](#heroku-triggersactivate-uuid)
* [`heroku triggers:create...`](#heroku-triggerscreate)
* [`heroku triggers:deactivate <uuid>...`](#heroku-triggersdeactivate-uuid)
* [`heroku triggers:delete <uuid>...`](#heroku-triggersdelete-uuid)
* [`heroku triggers:update <uuid>...`](#heroku-triggersupdate-uuid)

## `heroku triggers...`

List the Advanced Scheduler triggers for an app

```
USAGE
  $ heroku triggers...

OPTIONS
  -a, --app=app  (required) app to run command against
  -h, --help     show CLI help
  -j, --json     output triggers in json format

EXAMPLE
  $ heroku triggers -a example
```

_See code: [src/commands/triggers.ts](https://github.com/oavanruiten/advanced-scheduler/blob/v2.2.1/src/commands/triggers.ts)_

## `heroku triggers:activate <uuid>...`

Activate an Advanced Scheduler trigger for an app

```
USAGE
  $ heroku triggers:activate <uuid>...

ARGUMENTS
  UUID  uuid of the Advanced Scheduler trigger

OPTIONS
  -a, --app=app  (required) app to run command against
  -f, --force
  -h, --help     show CLI help
```

_See code: [src/commands/triggers/activate.ts](https://github.com/oavanruiten/advanced-scheduler/blob/v2.2.1/src/commands/triggers/activate.ts)_

## `heroku triggers:create...`

Create a new Advanced Scheduler trigger for an app

```
USAGE
  $ heroku triggers:create...

OPTIONS
  -a, --app=app                                                                                         (required) app
                                                                                                        to run command
                                                                                                        against

  -h, --help                                                                                            show CLI help

  --dyno=Free|Hobby|Standard-1X|Standartd-2X|Performance-M|Performance-L|Private-S|Private-M|Private-L  (required) dyno
                                                                                                        for task
                                                                                                        execution

  --frequencyType=recurring|one-off                                                                     (required)
                                                                                                        frequency of
                                                                                                        trigger
                                                                                                        execution

  --name=name                                                                                           (required) name
                                                                                                        of trigger

  --schedule=schedule                                                                                   (required)
                                                                                                        schedule of
                                                                                                        trigger
                                                                                                        execution

  --state=active|inactive                                                                               [default:
                                                                                                        active] state of
                                                                                                        trigger

  --timeout=timeout                                                                                     [default: 1800]
                                                                                                        timeout of task
                                                                                                        execution

  --timezone=timezone                                                                                   [default: UTC]
                                                                                                        timezone of
                                                                                                        trigger

  --value=value                                                                                         (required)
                                                                                                        command of
                                                                                                        trigger

EXAMPLES
  $ heroku triggers:create -a example --name "Trigger created via CLI" --frequencyType recurring  --schedule "* * * * *" 
  --value "npm run something" --dyno Free
  $ heroku triggers:create -a example --name "Trigger created via CLI" --frequencyType one-off  --schedule "2025-12-25 
  00:00:00" --value "npm run something" --dyno Free
```

_See code: [src/commands/triggers/create.ts](https://github.com/oavanruiten/advanced-scheduler/blob/v2.2.1/src/commands/triggers/create.ts)_

## `heroku triggers:deactivate <uuid>...`

Deactivate an Advanced Scheduler trigger for an app

```
USAGE
  $ heroku triggers:deactivate <uuid>...

ARGUMENTS
  UUID  uuid of the Advanced Scheduler trigger

OPTIONS
  -a, --app=app  (required) app to run command against
  -f, --force
  -h, --help     show CLI help
```

_See code: [src/commands/triggers/deactivate.ts](https://github.com/oavanruiten/advanced-scheduler/blob/v2.2.1/src/commands/triggers/deactivate.ts)_

## `heroku triggers:delete <uuid>...`

Permanently delete an Advanced Scheduler trigger for an app

```
USAGE
  $ heroku triggers:delete <uuid>...

ARGUMENTS
  UUID  uuid of the Advanced Scheduler trigger

OPTIONS
  -a, --app=app  (required) app to run command against
  -h, --help     show CLI help

EXAMPLE
  $ heroku triggers:delete 01234567-89ab-cdef-0123-456789abcdef -a example
```

_See code: [src/commands/triggers/delete.ts](https://github.com/oavanruiten/advanced-scheduler/blob/v2.2.1/src/commands/triggers/delete.ts)_

## `heroku triggers:update <uuid>...`

Update an Advanced Scheduler trigger for an app

```
USAGE
  $ heroku triggers:update <uuid>...

ARGUMENTS
  UUID  uuid of the Advanced Scheduler trigger

OPTIONS
  -a, --app=app                                                                                         (required) app
                                                                                                        to run command
                                                                                                        against

  -h, --help                                                                                            show CLI help

  --dyno=Free|Hobby|Standard-1X|Standartd-2X|Performance-M|Performance-L|Private-S|Private-M|Private-L  dyno for task
                                                                                                        execution

  --frequencyType=recurring|one-off                                                                     frequency of
                                                                                                        trigger
                                                                                                        execution

  --name=name                                                                                           name of trigger

  --schedule=schedule                                                                                   schedule of
                                                                                                        trigger
                                                                                                        execution

  --state=active|inactive                                                                               state of trigger

  --timeout=timeout                                                                                     timeout of task
                                                                                                        execution

  --timezone=timezone                                                                                   timezone of
                                                                                                        trigger

  --value=value                                                                                         command of
                                                                                                        trigger

EXAMPLES
  $ heroku triggers:update 01234567-89ab-cdef-0123-456789abcdef -a example --name "Trigger updated via CLI" 
  --frequencyType recurring  --schedule "* * * * *" --value "npm run something-else" --dyno Free
  $ heroku triggers:update 01234567-89ab-cdef-0123-456789abcdef -a example --name "Trigger updated via CLI" 
  --frequencyType one-off  --schedule "2025-12-25 00:00:00" --value "npm run something-else" --dyno Free
```

_See code: [src/commands/triggers/update.ts](https://github.com/oavanruiten/advanced-scheduler/blob/v2.2.1/src/commands/triggers/update.ts)_
<!-- commandsstop -->

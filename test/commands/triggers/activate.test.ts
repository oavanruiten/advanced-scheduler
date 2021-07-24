import {expect, test} from '@oclif/test'

describe('triggers:activate', () => {
  test
  .stdout()
  .command(['triggers:activate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['triggers:activate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})

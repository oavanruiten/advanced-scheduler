import {expect, test} from '@oclif/test'

describe('triggers:deactivate', () => {
  test
  .stdout()
  .command(['triggers:deactivate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['triggers:deactivate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})

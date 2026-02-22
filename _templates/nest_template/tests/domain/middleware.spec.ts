import { buildRequestContext } from '../../src/platform/transport/http/context'
import {
  AuthGuard,
  MiddlewareError,
  PolicyGuard,
} from '../../src/platform/transport/http/guards'
import { RequestValidationPipe } from '../../src/platform/transport/http/pipes'

describe('Middleware contracts', () => {
  it('rejects unauthenticated requests', () => {
    const guard = new AuthGuard()
    const context = buildRequestContext({})

    expect(() => guard.check(context)).toThrow(MiddlewareError)
  })

  it('rejects missing policy', () => {
    const guard = new PolicyGuard()
    const context = buildRequestContext({ 'x-user-id': 'user-1' })

    expect(() => guard.check(context, 'sample:create')).toThrow(MiddlewareError)
  })

  it('validates create-sample payload', () => {
    const pipe = new RequestValidationPipe()
    const invalidPayload = Object.assign(
      { name: '' },
      { totalCents: 100 },
      { isPriority: false },
    )

    expect(() => pipe.transform(invalidPayload)).toThrow(MiddlewareError)
  })
})

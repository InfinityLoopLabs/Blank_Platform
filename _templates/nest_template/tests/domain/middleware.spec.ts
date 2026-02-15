import { AuthGuard, MiddlewareError, PolicyGuard } from '../../src/platform/transport/http/guards';
import { buildRequestContext } from '../../src/platform/transport/http/context';
import { RequestValidationPipe } from '../../src/platform/transport/http/pipes';

describe('Middleware contracts', () => {
  it('rejects unauthenticated requests', () => {
    const guard = new AuthGuard();
    const context = buildRequestContext({});

    expect(() => guard.check(context)).toThrow(MiddlewareError);
  });

  it('rejects missing policy', () => {
    const guard = new PolicyGuard();
    const context = buildRequestContext({ 'x-user-id': 'user-1' });

    expect(() => guard.check(context, 'sample:create')).toThrow(MiddlewareError);
  });

  it('validates create-sample payload', () => {
    const pipe = new RequestValidationPipe();

    expect(() => pipe.transform({ name: '', totalCents: 100, isPriority: false })).toThrow(MiddlewareError);
  });
});

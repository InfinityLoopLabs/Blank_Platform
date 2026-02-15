import { ResponseFactory } from '../../src/platform/transport/http/response.factory';

describe('ResponseFactory', () => {
  const factory = new ResponseFactory();
  const context = {
    requestId: 'req-1',
    correlationId: 'corr-1',
    traceId: 'trace-1',
    spanId: 'span-1',
    isAuthenticated: true,
    canCreateSample: true,
  };

  it('returns success envelope', () => {
    const response = factory.created('created', { id: '1' }, context);
    expect(response.statusCode).toBe(201);
    expect(response.envelope.error).toBeNull();
    expect(response.envelope.payload).not.toBeNull();
  });

  it('returns ok envelope', () => {
    const response = factory.ok('ok', { status: 'up' }, context);
    expect(response.statusCode).toBe(200);
    expect(response.envelope.error).toBeNull();
  });

  it('returns error envelope', () => {
    const response = factory.error(400, 'bad request', 'VALIDATION_ERROR', context);
    expect(response.statusCode).toBe(400);
    expect(response.envelope.payload).toBeNull();
    expect(response.envelope.error?.code).toBe('VALIDATION_ERROR');
  });
});

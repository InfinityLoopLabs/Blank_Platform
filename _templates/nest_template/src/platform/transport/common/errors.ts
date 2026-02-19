export class TransportError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export function mapTransportError(error: unknown): {
  statusCode: number;
  code: string;
  message: string;
} {
  if (error instanceof TransportError) {
    if (error.code === 'VALIDATION_ERROR') {
      return {
        statusCode: 400,
        code: error.code,
        message: error.message,
      };
    }
    if (error.code === 'UNAUTHENTICATED') {
      return {
        statusCode: 401,
        code: error.code,
        message: error.message,
      };
    }
    if (error.code === 'FORBIDDEN') {
      return {
        statusCode: 403,
        code: error.code,
        message: error.message,
      };
    }
    if (
      error.code === 'SCHEMA_INCOMPATIBLE' ||
      error.code === 'DEPENDENCY_UNAVAILABLE'
    ) {
      return {
        statusCode: 503,
        code: error.code,
        message: error.message,
      };
    }
  }

  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'internal server error',
  };
}

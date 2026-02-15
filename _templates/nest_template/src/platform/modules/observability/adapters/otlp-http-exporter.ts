import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

import { ObservabilityEvent } from '../domain/observability-event';
import { ObservabilityExporter } from '../ports/exporter.port';

type OtelAttribute = {
  key: string;
  value: {
    stringValue?: string;
    boolValue?: boolean;
    intValue?: string;
    doubleValue?: number;
  };
};

export class OtlpHttpExporter implements ObservabilityExporter {
  private readonly url: URL;

  constructor(endpoint: string) {
    this.url = OtlpHttpExporter.normalizeEndpoint(endpoint);
  }

  async export(event: ObservabilityEvent): Promise<boolean> {
    const payload = {
      resourceLogs: [
        {
          resource: {
            attributes: [
              this.attribute('service.name', event.serviceName),
              this.attribute('deployment.environment', event.environment),
            ],
          },
          scopeLogs: [
            {
              scope: { name: 'sample-nest.observability' },
              logRecords: [
                {
                  timeUnixNano: this.timeToUnixNano(event.timestamp),
                  severityText: 'INFO',
                  body: { stringValue: event.event },
                  attributes: this.fieldsToAttributes(event.fields),
                },
              ],
            },
          ],
        },
      ],
    };

    return this.postJson(payload);
  }

  private static normalizeEndpoint(endpoint: string): URL {
    const hasScheme = endpoint.startsWith('http://') || endpoint.startsWith('https://');
    const url = new URL(hasScheme ? endpoint : `http://${endpoint}`);
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/v1/logs';
    }
    return url;
  }

  private fieldsToAttributes(fields: Record<string, unknown>): OtelAttribute[] {
    return Object.entries(fields).map(([key, value]) => this.attribute(key, value));
  }

  private attribute(key: string, value: unknown): OtelAttribute {
    if (typeof value === 'boolean') {
      return { key, value: { boolValue: value } };
    }
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return { key, value: { intValue: `${value}` } };
      }
      return { key, value: { doubleValue: value } };
    }
    if (typeof value === 'string') {
      return { key, value: { stringValue: value } };
    }
    return { key, value: { stringValue: JSON.stringify(value) } };
  }

  private timeToUnixNano(timestamp: string): string {
    const milliseconds = Date.parse(timestamp);
    return `${milliseconds * 1_000_000}`;
  }

  private async postJson(payload: unknown): Promise<boolean> {
    const data = JSON.stringify(payload);
    const isHttps = this.url.protocol === 'https:';
    const requestFn = isHttps ? httpsRequest : httpRequest;

    return new Promise<boolean>((resolve) => {
      const req = requestFn(
        this.url,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(data),
          },
        },
        (res) => {
          const status = res.statusCode ?? 500;
          res.resume();
          resolve(status >= 200 && status < 300);
        },
      );

      req.on('error', () => resolve(false));
      req.write(data);
      req.end();
    });
  }
}

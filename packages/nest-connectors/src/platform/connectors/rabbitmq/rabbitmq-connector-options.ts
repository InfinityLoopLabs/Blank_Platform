import { RmqOptions } from '@nestjs/microservices';

import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type RabbitMqConnectorOptions = NonNullable<RmqOptions['options']>;

export type RabbitMqConnectorAsyncOptions = ConnectorAsyncOptions<RabbitMqConnectorOptions>;

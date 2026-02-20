import { KafkaOptions } from '@nestjs/microservices';

import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type KafkaConnectorOptions = NonNullable<KafkaOptions['options']>;

export type KafkaConnectorAsyncOptions = ConnectorAsyncOptions<KafkaConnectorOptions>;

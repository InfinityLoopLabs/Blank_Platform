import { RedisOptions } from 'ioredis';

import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type RedisConnectorOptions = RedisOptions;

export type RedisConnectorAsyncOptions = ConnectorAsyncOptions<RedisConnectorOptions>;

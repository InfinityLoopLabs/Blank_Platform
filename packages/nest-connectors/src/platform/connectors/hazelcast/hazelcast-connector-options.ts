import { ClientConfig } from 'hazelcast-client';

import { ConnectorAsyncOptions } from '../shared/connector-async-options';

export type HazelcastConnectorOptions = ClientConfig;

export type HazelcastConnectorAsyncOptions = ConnectorAsyncOptions<HazelcastConnectorOptions>;

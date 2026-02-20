import { existsSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

loadEnvironmentFiles();

const port = readInt(process.env.POSTGRES_PORT, 20432);

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port,
  username: process.env.POSTGRES_USER ?? 'app',
  password: process.env.POSTGRES_PASSWORD ?? 'app',
  database: process.env.POSTGRES_DB ?? 'app',
  synchronize: false,
  logging: false,
  migrationsTableName: 'schema_migrations',
  entities: ['src/**/*.entity.{ts,js}', 'src/**/*.orm-entity.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
});

function loadEnvironmentFiles(): void {
  const runtimeEnv = (process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development').trim() || 'development';
  const envFiles = [`.env.${runtimeEnv}`, '.env'];

  envFiles.forEach((relativePath) => {
    const fullPath = join(process.cwd(), relativePath);
    if (!existsSync(fullPath)) {
      return;
    }
    process.loadEnvFile(fullPath);
  });
}

function readInt(value: string | undefined, fallback: number): number {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`POSTGRES_PORT must be integer, got: ${value}`);
  }
  return parsed;
}

import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export type MigrationFile = {
  id: string;
  fileName: string;
  fullPath: string;
  script: string;
  checksum: string;
};

export function readMigrationFiles(directory: string, extension: string): MigrationFile[] {
  if (!existsSync(directory)) {
    return [];
  }

  const fileNames = readdirSync(directory)
    .filter((fileName) => fileName.endsWith(extension))
    .sort((left, right) => left.localeCompare(right));

  return fileNames.map((fileName) => {
    const fullPath = join(directory, fileName);
    const script = readFileSync(fullPath, 'utf8').trim();
    if (script.length === 0) {
      throw new Error(`Migration file is empty: ${fullPath}`);
    }

    return {
      id: fileName.slice(0, -extension.length),
      fileName,
      fullPath,
      script,
      checksum: createHash('sha256').update(script).digest('hex'),
    };
  });
}

export function printStatus(
  engine: string,
  total: number,
  applied: number,
  pending: string[],
  mismatches: string[],
): void {
  // eslint-disable-next-line no-console
  console.log(`[${engine}] total=${total} applied=${applied} pending=${pending.length}`);
  if (pending.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`[${engine}] pending: ${pending.join(', ')}`);
  }
  if (mismatches.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`[${engine}] checksum mismatch: ${mismatches.join(', ')}`);
  }
}

import { MiddlewareError } from '../../../transport/http/guards';
import { ManifestEntry, MigrationRow, HealthStatus } from '../domain/health-status';

export class HealthService {
  private readonly manifest: ManifestEntry[] = [
    { version: '001_init', checksum: 'abc001' },
    { version: '002_sample', checksum: 'abc002' },
  ];

  private applied: MigrationRow[] = [
    { version: '001_init', checksum: 'abc001', appliedAt: '2026-01-01T00:00:00Z', status: 'applied', isDirty: false },
    { version: '002_sample', checksum: 'abc002', appliedAt: '2026-01-02T00:00:00Z', status: 'applied', isDirty: false },
  ];

  private readonly minRequiredVersion = '002_sample';
  private isDbAvailable = true;

  constructor(mode: string) {
    switch (mode || 'ok') {
      case 'ok':
        break;
      case 'dirty':
        this.applied[1].isDirty = true;
        break;
      case 'checksum_mismatch':
        this.applied[1].checksum = 'wrong';
        break;
      case 'missing_version':
        this.applied = this.applied.slice(0, 1);
        break;
      case 'db_down':
        this.isDbAvailable = false;
        break;
      default:
        throw new Error('SCHEMA_MODE must be one of: ok, dirty, checksum_mismatch, missing_version, db_down');
    }
  }

  status(): HealthStatus {
    const issues: string[] = [];
    let reasonCode = 'OK';
    let isReadinessUp = true;
    let canWrite = true;

    if (!this.isDbAvailable) {
      issues.push('database_unavailable');
      reasonCode = 'DEPENDENCY_UNAVAILABLE';
      isReadinessUp = false;
      canWrite = false;
    }

    this.applied.forEach((row) => {
      if (row.isDirty) {
        issues.push(`dirty_migration:${row.version}`);
        reasonCode = 'SCHEMA_INCOMPATIBLE';
        isReadinessUp = false;
        canWrite = false;
      }
    });

    this.manifest.forEach((entry) => {
      const found = this.applied.find((row) => row.version === entry.version);
      if (!found) {
        issues.push(`missing_version:${entry.version}`);
        reasonCode = 'SCHEMA_INCOMPATIBLE';
        isReadinessUp = false;
        canWrite = false;
        return;
      }
      if (found.checksum !== entry.checksum) {
        issues.push(`checksum_mismatch:${entry.version}`);
        reasonCode = 'SCHEMA_INCOMPATIBLE';
        isReadinessUp = false;
        canWrite = false;
      }
    });

    if (!this.applied.find((row) => row.version === this.minRequiredVersion)) {
      issues.push(`missing_required_version:${this.minRequiredVersion}`);
      reasonCode = 'SCHEMA_INCOMPATIBLE';
      isReadinessUp = false;
      canWrite = false;
    }

    return {
      migrationTable: 'schema_migrations(version, checksum, applied_at, status, dirty)',
      isLivenessUp: true,
      isReadinessUp,
      canWrite,
      reasonCode,
      issues,
      manifest: this.manifest,
      applied: this.applied,
      isDbAvailable: this.isDbAvailable,
    };
  }

  ensureWriteAllowed(): void {
    const status = this.status();
    if (status.reasonCode === 'DEPENDENCY_UNAVAILABLE') {
      throw new MiddlewareError('DEPENDENCY_UNAVAILABLE', 'dependency unavailable');
    }
    if (!status.canWrite) {
      throw new MiddlewareError('SCHEMA_INCOMPATIBLE', 'schema incompatible');
    }
  }
}

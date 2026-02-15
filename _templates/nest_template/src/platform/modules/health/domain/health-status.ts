export type ManifestEntry = {
  version: string;
  checksum: string;
};

export type MigrationRow = {
  version: string;
  checksum: string;
  appliedAt: string;
  status: string;
  isDirty: boolean;
};

export type HealthStatus = {
  migrationTable: string;
  isLivenessUp: boolean;
  isReadinessUp: boolean;
  canWrite: boolean;
  reasonCode: string;
  issues: string[];
  manifest: ManifestEntry[];
  applied: MigrationRow[];
  isDbAvailable: boolean;
};

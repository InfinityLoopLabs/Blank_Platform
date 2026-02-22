export type ManifestEntryType = {
  version: string
  checksum: string
}

export type MigrationRowType = {
  version: string
  checksum: string
  appliedAt: string
  status: string
  isDirty: boolean
}

export type HealthStatusType = {
  migrationTable: string
  isLivenessUp: boolean
  isReadinessUp: boolean
  canWrite: boolean
  reasonCode: string
  issues: string[]
  manifest: ManifestEntryType[]
  applied: MigrationRowType[]
  isDbAvailable: boolean
}

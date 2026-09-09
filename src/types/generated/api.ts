// This file is generated from openapi/openapi.json.
// Run `npm run api:generate` after updating the API contract.

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type AuditEvent =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'restored'
  | 'force_deleted'
  | 'permissions_synced'
  | 'roles_synced';

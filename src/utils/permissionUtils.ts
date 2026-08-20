import type { Permission } from '../types/role';

export interface PermissionResourceGroup {
  name: string;
  permissions: Permission[];
}

export interface PermissionGuardGroup {
  name: string;
  resources: PermissionResourceGroup[];
}

export function getPermissionResource(permissionName: string): string {
  const resource = permissionName.split('.')[0] ?? permissionName;

  return resource
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function groupPermissions(
  permissions: Permission[],
): PermissionGuardGroup[] {
  const guards = new Map<string, Map<string, Permission[]>>();

  for (const permission of permissions) {
    if (!guards.has(permission.guard_name)) {
      guards.set(permission.guard_name, new Map());
    }

    const resources = guards.get(permission.guard_name)!;
    const resource = getPermissionResource(permission.name);

    if (!resources.has(resource)) {
      resources.set(resource, []);
    }

    resources.get(resource)!.push(permission);
  }

  return Array.from(guards.entries()).map(([guard, resources]) => ({
    name: guard,
    resources: Array.from(resources.entries()).map(
      ([resource, resourcePermissions]) => ({
        name: resource,
        permissions: resourcePermissions,
      }),
    ),
  }));
}

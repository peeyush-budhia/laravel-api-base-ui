import { useMemo } from 'react';

import type { Permission } from '../../types/role';

interface PermissionGroupsProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

interface PermissionGroup {
  guard: string;
  resources: Map<string, Permission[]>;
}

function getResourceName(permissionName: string): string {
  const resource = permissionName.split('.')[0] ?? permissionName;

  return resource
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function groupPermissions(permissions: Permission[]): PermissionGroup[] {
  const guards = new Map<string, Map<string, Permission[]>>();

  for (const permission of permissions) {
    if (!guards.has(permission.guard_name)) {
      guards.set(permission.guard_name, new Map());
    }

    const resources = guards.get(permission.guard_name)!;
    const resource = getResourceName(permission.name);

    if (!resources.has(resource)) {
      resources.set(resource, []);
    }

    resources.get(resource)!.push(permission);
  }

  return Array.from(guards.entries()).map(([guard, resources]) => ({
    guard,
    resources,
  }));
}

export default function PermissionGroups({
  permissions,
  selectedPermissions,
  onChange,
  disabled = false,
  readOnly = false,
}: PermissionGroupsProps) {
  const groups = useMemo(() => groupPermissions(permissions), [permissions]);

  const selected = useMemo(
    () => new Set(selectedPermissions),
    [selectedPermissions],
  );

  function togglePermission(permissionName: string) {
    if (disabled || readOnly) {
      return;
    }

    const next = new Set(selected);

    if (next.has(permissionName)) {
      next.delete(permissionName);
    } else {
      next.add(permissionName);
    }

    onChange(Array.from(next));
  }

  function toggleResource(resourcePermissions: Permission[]) {
    if (disabled || readOnly) {
      return;
    }

    const next = new Set(selected);

    const allSelected = resourcePermissions.every((permission) =>
      next.has(permission.name),
    );

    for (const permission of resourcePermissions) {
      if (allSelected) {
        next.delete(permission.name);
      } else {
        next.add(permission.name);
      }
    }

    onChange(Array.from(next));
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div
          key={group.guard}
          className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
        >
          {/* Guard */}
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {group.guard}
            </h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from(group.resources.entries()).map(
              ([resource, resourcePermissions]) => {
                const selectedCount = resourcePermissions.filter((permission) =>
                  selected.has(permission.name),
                ).length;

                const allSelected =
                  selectedCount === resourcePermissions.length;

                return (
                  <div key={resource} className="p-5">
                    {/* Resource header */}
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {resource}
                        </h4>

                        {!readOnly && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {selectedCount} of {resourcePermissions.length}{' '}
                            selected
                          </p>
                        )}
                      </div>

                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => toggleResource(resourcePermissions)}
                          disabled={disabled}
                          className="text-xs font-medium text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {allSelected ? 'Clear all' : 'Select all'}
                        </button>
                      )}
                    </div>

                    {/* Permissions */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {resourcePermissions.map((permission) => {
                        const isSelected = selected.has(permission.name);

                        if (readOnly) {
                          return (
                            <div
                              key={permission.id}
                              className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800"
                            >
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-brand-500 bg-brand-500 text-[10px] text-white">
                                  ✓
                                </span>

                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                                    {permission.description}
                                  </span>

                                  <span className="mt-0.5 block truncate text-xs text-gray-400 dark:text-gray-500">
                                    {permission.name}
                                  </span>
                                </span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <label
                            key={permission.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                              isSelected
                                ? 'border-brand-300 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10'
                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                            } ${
                              disabled ? 'cursor-not-allowed opacity-60' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={disabled}
                              onChange={() => togglePermission(permission.name)}
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700"
                            />

                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                                {permission.description}
                              </span>

                              <span className="mt-0.5 block truncate text-xs text-gray-400 dark:text-gray-500">
                                {permission.name}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      ))}

      {permissions.length === 0 && (
        <div className="rounded-xl border border-gray-200 px-5 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          No permissions available.
        </div>
      )}
    </div>
  );
}

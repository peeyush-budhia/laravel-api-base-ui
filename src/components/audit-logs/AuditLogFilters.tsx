import type React from 'react';

import FilterBar from '../common/Filters/FilterBar';
import FilterSearch from '../common/Filters/FilterSearch';
import FilterSelect from '../common/Filters/FilterSelect';
import { PerPageSelect } from '../common/Table';

interface AuditLogFiltersProps {
  searchInput: string;
  search: string;

  event: string;

  perPage: number;

  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;

  onEventChange: (value: string) => void;
  onPerPageChange: (value: number) => void;

  disabled?: boolean;
}

const eventOptions = [
  {
    value: '',
    label: 'All events',
  },
  {
    value: 'created',
    label: 'Created',
  },
  {
    value: 'updated',
    label: 'Updated',
  },
  {
    value: 'deleted',
    label: 'Deleted',
  },
  {
    value: 'restored',
    label: 'Restored',
  },
  {
    value: 'force_deleted',
    label: 'Force deleted',
  },
  {
    value: 'permissions_synced',
    label: 'Permissions Synced',
  },
];

export default function AuditLogFilters({
  searchInput,
  search,
  event,
  perPage,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onEventChange,
  onPerPageChange,
  disabled = false,
}: AuditLogFiltersProps) {
  return (
    <FilterBar onSubmit={onSearchSubmit} className="flex-wrap">
      <FilterSearch
        value={searchInput}
        onChange={onSearchInputChange}
        placeholder="Search audit logs..."
        onClear={onClearSearch}
        showClear={Boolean(search)}
        disabled={disabled}
      />

      <FilterSelect
        value={event}
        options={eventOptions}
        onChange={onEventChange}
        disabled={disabled}
        className="sm:w-44"
      />

      <PerPageSelect
        value={perPage}
        onChange={onPerPageChange}
        disabled={disabled}
      />
    </FilterBar>
  );
}

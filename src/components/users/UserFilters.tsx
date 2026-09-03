import type React from 'react';

import FilterBar from '../common/Filters/FilterBar';
import FilterSearch from '../common/Filters/FilterSearch';
import FilterSelect from '../common/Filters/FilterSelect';
import { PerPageSelect } from '../common/Table';

interface UserFiltersProps {
  searchInput: string;
  search: string;

  trashed: 'without' | 'with' | 'only';

  perPage: number;

  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;

  onTrashedChange: (value: 'without' | 'with' | 'only') => void;
  onPerPageChange: (value: number) => void;

  disabled?: boolean;
}

const filterOptions = [
  {
    value: 'without',
    label: 'All users',
  },
  {
    value: 'with',
    label: 'With deleted',
  },
  {
    value: 'only',
    label: 'Deleted only',
  },
];

export default function UserFilters({
  searchInput,
  search,
  trashed,
  perPage,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onTrashedChange,
  onPerPageChange,
  disabled = false,
}: UserFiltersProps) {
  return (
    <FilterBar onSubmit={onSearchSubmit} className="flex-wrap">
      <FilterSearch
        value={searchInput}
        onChange={onSearchInputChange}
        placeholder="Search users..."
        onClear={onClearSearch}
        showClear={Boolean(search)}
        disabled={disabled}
      />

      <FilterSelect
        value={trashed}
        options={filterOptions}
        onChange={(value) =>
          onTrashedChange(value as 'without' | 'with' | 'only')
        }
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

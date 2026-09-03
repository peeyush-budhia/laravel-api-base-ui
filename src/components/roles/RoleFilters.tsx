import type React from 'react';

import FilterBar from '../common/Filters/FilterBar';
import FilterSearch from '../common/Filters/FilterSearch';
import { PerPageSelect } from '../common/Table';

interface RoleFiltersProps {
  searchInput: string;
  search: string;

  perPage: number;

  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;

  onPerPageChange: (value: number) => void;

  disabled?: boolean;
}

export default function RoleFilters({
  searchInput,
  search,
  perPage,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onPerPageChange,
  disabled = false,
}: RoleFiltersProps) {
  return (
    <FilterBar onSubmit={onSearchSubmit} className="flex-wrap">
      <FilterSearch
        value={searchInput}
        onChange={onSearchInputChange}
        placeholder="Search roles..."
        onClear={onClearSearch}
        showClear={Boolean(search)}
        disabled={disabled}
      />

      <PerPageSelect
        value={perPage}
        onChange={onPerPageChange}
        disabled={disabled}
      />
    </FilterBar>
  );
}

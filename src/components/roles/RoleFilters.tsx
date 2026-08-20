import type React from 'react';

import FilterBar from '../common/Filters/FilterBar';
import FilterSearch from '../common/Filters/FilterSearch';

interface RoleFiltersProps {
  searchInput: string;
  search: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
}

export default function RoleFilters({
  searchInput,
  search,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
}: RoleFiltersProps) {
  return (
    <FilterBar onSubmit={onSearchSubmit}>
      <FilterSearch
        value={searchInput}
        onChange={onSearchInputChange}
        placeholder="Search roles..."
        onClear={onClearSearch}
        showClear={Boolean(search)}
      />
    </FilterBar>
  );
}

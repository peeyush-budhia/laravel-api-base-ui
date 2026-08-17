import type React from 'react';

import type { UserTrashedFilter } from '../../types/user';

import FilterBar from '../common/Filters/FilterBar';
import FilterSearch from '../common/Filters/FilterSearch';
import FilterSelect from '../common/Filters/FilterSelect';

interface UserFiltersProps {
  searchInput: string;
  search: string;
  trashed: UserTrashedFilter;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
  onTrashedChange: (value: UserTrashedFilter) => void;
}

export default function UserFilters({
  searchInput,
  search,
  trashed,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onTrashedChange,
}: UserFiltersProps) {
  return (
    <FilterBar onSubmit={onSearchSubmit}>
      <FilterSearch
        value={searchInput}
        onChange={onSearchInputChange}
        placeholder="Search users..."
        onClear={onClearSearch}
        showClear={Boolean(search)}
      />

      <FilterSelect
        value={trashed}
        onChange={(value) => onTrashedChange(value as UserTrashedFilter)}
        options={[
          {
            value: 'without',
            label: 'Active Users',
          },
          {
            value: 'with',
            label: 'All Users',
          },
          {
            value: 'only',
            label: 'Deleted Users',
          },
        ]}
      />
    </FilterBar>
  );
}

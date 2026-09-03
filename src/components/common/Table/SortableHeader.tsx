import { TableCell } from '../../ui/table';

export interface SortableHeaderProps {
  field: string;
  label: string;
  sort: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
  className?: string;
}

function getSortIcon(
  field: string,
  sort: string,
  direction: 'asc' | 'desc',
): string {
  if (sort !== field) {
    return '↕';
  }

  return direction === 'asc' ? '↑' : '↓';
}

export default function SortableHeader({
  field,
  label,
  sort,
  direction,
  onSort,
  className = '',
}: SortableHeaderProps) {
  return (
    <TableCell
      isHeader
      className={`px-5 py-4 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1"
      >
        {label}

        <span aria-hidden="true" className="text-xs">
          {getSortIcon(field, sort, direction)}
        </span>
      </button>
    </TableCell>
  );
}

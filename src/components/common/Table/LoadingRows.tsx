import { TableCell, TableRow } from '../../ui/table';

interface LoadingRowsProps {
  columns: number;
  rows?: number;
}

export default function LoadingRows({ columns, rows = 5 }: LoadingRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`loading-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((__, cellIndex) => (
            <TableCell
              key={`loading-cell-${rowIndex}-${cellIndex}`}
              className="px-5 py-4"
            >
              <div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

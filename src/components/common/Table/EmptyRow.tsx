import { TableCell, TableRow } from '../../ui/table';

interface EmptyRowProps {
  colSpan: number;
  message?: string;
}

export default function EmptyRow({
  colSpan,
  message = 'No records found.',
}: EmptyRowProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}

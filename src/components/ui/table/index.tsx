import type {
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react';

// Props for Table
interface TableProps {
  children: ReactNode;
  className?: string;
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode;
  className?: string;
}

// Props for TableCell
type TableCellProps = (
  | ThHTMLAttributes<HTMLTableCellElement>
  | TdHTMLAttributes<HTMLTableCellElement>
) & {
  children?: ReactNode;
  isHeader?: boolean;
};

// Table Component
const Table = ({
  children,
  className,
  ...props
}: TableProps & TableHTMLAttributes<HTMLTableElement>) => {
  return (
    <table className={`min-w-full ${className ?? ''}`.trim()} {...props}>
      {children}
    </table>
  );
};

// TableHeader Component
const TableHeader = ({
  children,
  className,
  ...props
}: TableHeaderProps & React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
};

// TableBody Component
const TableBody = ({
  children,
  className,
  ...props
}: TableBodyProps & React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

// TableRow Component
const TableRow = ({
  children,
  className,
  ...props
}: TableRowProps & React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell = ({
  children,
  isHeader = false,
  className,
  ...props
}: TableCellProps) => {
  const classes = className ?? '';

  if (isHeader) {
    return (
      <th
        className={classes}
        {...(props as ThHTMLAttributes<HTMLTableCellElement>)}
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={classes}
      {...(props as TdHTMLAttributes<HTMLTableCellElement>)}
    >
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };

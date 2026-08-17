import type React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export default function FilterBar({
  children,
  onSubmit,
  className = '',
}: FilterBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-3 sm:flex-row ${className}`.trim()}
    >
      {children}
    </form>
  );
}

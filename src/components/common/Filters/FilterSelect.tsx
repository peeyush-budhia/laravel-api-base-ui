export interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function FilterSelect({
  value,
  options,
  onChange,
  disabled = false,
  className = '',
}: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className={`h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs outline-hidden transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${className}`.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

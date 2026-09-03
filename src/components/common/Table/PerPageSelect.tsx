import FilterSelect from '../Filters/FilterSelect';

export interface PerPageOption {
  value: number;
  label: string;
}

interface PerPageSelectProps {
  value: number;
  options?: PerPageOption[];
  onChange: (value: number) => void;
  disabled?: boolean;
}

const defaultOptions: PerPageOption[] = [
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 100, label: '100' },
];

export default function PerPageSelect({
  value,
  options = defaultOptions,
  onChange,
  disabled = false,
}: PerPageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        Show
      </span>

      <FilterSelect
        value={String(value)}
        options={options.map((option) => ({
          value: String(option.value),
          label: option.label,
        }))}
        onChange={(selectedValue) => onChange(Number(selectedValue))}
        disabled={disabled}
        className="w-20"
      />

      <span className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        per page
      </span>
    </div>
  );
}

import { useRef, useState } from 'react';

import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { MoreDotIcon } from '../../icons';

export type ActionItemVariant = 'default' | 'danger';

export interface ActionItem {
  label: string;
  onClick?: () => void;
  to?: string;
  variant?: ActionItemVariant;
  disabled?: boolean;
}

interface ActionsDropdownProps {
  items: ActionItem[];
  ariaLabel?: string;
  className?: string;
}

export default function ActionsDropdown({
  items,
  ariaLabel = 'Actions',
  className = 'w-44 p-1',
}: ActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeActions() {
    setIsOpen(false);
  }

  function handleAction(item: ActionItem) {
    if (item.disabled) {
      return;
    }

    closeActions();
    item.onClick?.();
  }

  function getItemClassName(item: ActionItem): string {
    const baseClassName =
      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm';

    if (item.variant === 'danger') {
      return `${baseClassName} text-error-500 hover:bg-error-50 hover:text-error-600 dark:text-error-400 dark:hover:bg-error-500/10 dark:hover:text-error-300`;
    }

    return `${baseClassName} text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300`;
  }

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="dropdown-toggle inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover hover dark dark:hover/5 dark:hover"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreDotIcon />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeActions}
        className={className}
        triggerRef={triggerRef}
      >
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <DropdownItem
                  tag="a"
                  to={item.to}
                  onItemClick={closeActions}
                  baseClassName=""
                  className={getItemClassName(item)}
                >
                  {item.label}
                </DropdownItem>
              ) : (
                <DropdownItem
                  onClick={() => handleAction(item)}
                  baseClassName=""
                  className={getItemClassName(item)}
                >
                  {item.label}
                </DropdownItem>
              )}
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}

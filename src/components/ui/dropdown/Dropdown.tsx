import type React from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

interface DropdownPosition {
  top: number;
  left: number;
  visibility: 'hidden' | 'visible';
}

const DROPDOWN_GAP = 8;
const VIEWPORT_PADDING = 8;

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  triggerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    visibility: 'hidden',
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef?.current;
    const dropdown = dropdownRef.current;

    if (!trigger || !dropdown) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();

    const menuWidth = dropdownRect.width;
    const menuHeight = dropdownRect.height;

    const spaceAbove = triggerRect.top;
    const spaceBelow = window.innerHeight - triggerRect.bottom;

    const shouldOpenUpward =
      spaceBelow < menuHeight + DROPDOWN_GAP &&
      spaceAbove >= menuHeight + DROPDOWN_GAP;

    const top = shouldOpenUpward
      ? triggerRect.top - menuHeight - DROPDOWN_GAP
      : triggerRect.bottom + DROPDOWN_GAP;

    const preferredLeft = triggerRect.right - menuWidth;

    const maxLeft = window.innerWidth - menuWidth - VIEWPORT_PADDING;

    const left = Math.min(
      Math.max(preferredLeft, VIEWPORT_PADDING),
      Math.max(maxLeft, VIEWPORT_PADDING),
    );

    setPosition({
      top: Math.max(top, VIEWPORT_PADDING),
      left,
      visibility: 'visible',
    });
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      updatePosition();
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [isOpen, updatePosition]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleResize = () => {
      updatePosition();
    };

    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (dropdownRef.current?.contains(target)) {
        return;
      }

      if (triggerRef?.current?.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={dropdownRef}
      className={`fixed z-[99999] rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
      style={{
        top: position.top,
        left: position.left,
        visibility: position.visibility,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

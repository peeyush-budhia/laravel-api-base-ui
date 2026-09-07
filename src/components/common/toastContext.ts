import { createContext } from 'react';

type ToastType = 'success';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  durationMs?: number;
}

export interface ToastState extends Required<Omit<ToastOptions, 'type'>> {
  type: ToastType;
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);

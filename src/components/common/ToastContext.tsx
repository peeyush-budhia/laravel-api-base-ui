import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import Toast from './Toast';
import {
  ToastContext,
  type ToastOptions,
  type ToastState,
} from './toastContext';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    setToast({
      type: options.type ?? 'success',
      title: options.title ?? 'Notification',
      message: options.message,
      durationMs: options.durationMs ?? 7500,
    });
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && (
        <div className="pointer-events-none fixed right-4 top-4 z-[99999] w-[calc(100vw-2rem)] max-w-sm">
          <Toast
            title={toast.title}
            message={toast.message}
            onClose={hideToast}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
}

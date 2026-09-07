import type { ReactNode } from 'react';

interface StateMessageProps {
  role: 'alert' | 'status';
  ariaLive: 'assertive' | 'polite';
  title: string;
  message: string;
  className?: string;
  surfaceClassName: string;
  iconWrapperClassName: string;
  titleClassName: string;
  messageClassName: string;
  icon: ReactNode;
  children?: ReactNode;
}

export default function StateMessage({
  role,
  ariaLive,
  title,
  message,
  className = '',
  surfaceClassName,
  iconWrapperClassName,
  titleClassName,
  messageClassName,
  icon,
  children,
}: StateMessageProps) {
  return (
    <div
      className={`flex min-h-[120px] items-center justify-center px-4 py-4 ${className}`}
      role={role}
      aria-live={ariaLive}
    >
      <div
        className={`w-full rounded-2xl border px-4 py-4 text-left shadow-sm ${surfaceClassName}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconWrapperClassName}`}
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className={`text-sm font-semibold ${titleClassName}`}>
              {title}
            </h2>

            <p className={`mt-1 text-sm ${messageClassName}`}>{message}</p>

            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

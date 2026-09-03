interface FormErrorProps {
  message?: string | null;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400"
    >
      {message}
    </div>
  );
}

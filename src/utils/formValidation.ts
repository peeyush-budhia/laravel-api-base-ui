export type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

export function required(
  value: string,
  message = 'This field is required.',
): string[] | undefined {
  if (!value.trim()) {
    return [message];
  }

  return undefined;
}

export function email(
  value: string,
  message = 'Please enter a valid email address.',
): string[] | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value.trim())) {
    return [message];
  }

  return undefined;
}

export function minLength(
  value: string,
  length: number,
  message?: string,
): string[] | undefined {
  if (!value) {
    return undefined;
  }

  if (value.length < length) {
    return [message ?? `Must be at least ${length} characters.`];
  }

  return undefined;
}

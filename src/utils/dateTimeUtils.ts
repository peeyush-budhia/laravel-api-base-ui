export function formatDateTime(value: string | null): string {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);

  const datePart = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return `${datePart.replace(/\//g, '-')}, ${timePart}`;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);

  const datePart = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  return `${datePart.replace(/\//g, '-')}`;
}

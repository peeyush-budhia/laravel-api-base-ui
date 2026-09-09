export type SemanticTone = 'success' | 'warning' | 'danger' | 'info';

export const semanticToneColors: Record<
  SemanticTone,
  'success' | 'warning' | 'error' | 'info'
> = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
  info: 'info',
};

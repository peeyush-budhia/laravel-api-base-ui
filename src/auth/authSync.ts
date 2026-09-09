export type AuthSyncMessage =
  | { type: 'token-request' }
  | { type: 'token-response'; token: string }
  | { type: 'logout'; token: string };

const AUTH_CHANNEL_NAME = 'laravel-api-base-auth';

export function createAuthSyncChannel(): BroadcastChannel | null {
  if (typeof window.BroadcastChannel === 'undefined') {
    return null;
  }

  try {
    return new window.BroadcastChannel(AUTH_CHANNEL_NAME);
  } catch {
    return null;
  }
}

export function isAuthSyncMessage(value: unknown): value is AuthSyncMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const message = value as Record<string, unknown>;

  if (message.type === 'token-request') {
    return true;
  }

  return (
    (message.type === 'token-response' || message.type === 'logout') &&
    typeof message.token === 'string' &&
    message.token.length > 0
  );
}

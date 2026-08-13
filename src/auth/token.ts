const ACCESS_TOKEN_KEY = 'access_token';

export const tokenStorage = {
  get(): string | null {
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) ??
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  set(token: string, rememberMe: boolean): void {
    this.clear();

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

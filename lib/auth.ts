export const AUTH_USERS = ["Ally", "Gary", "Daniel", "Apple", "Candy"] as const;
export const AUTH_PASSWORD = "123456";
export const AUTH_STORAGE_KEY = "candy-current-user";
export const AUTH_COOKIE_KEY = "candy-current-user";
export const AUTH_CHANGE_EVENT = "candy-auth-change";

export type AuthUser = (typeof AUTH_USERS)[number];

export function isAuthUser(value: string): value is AuthUser {
  return AUTH_USERS.includes(value as AuthUser);
}

"use client";

import { authApi, UserProfile } from "./api";

const TOKEN_KEY = "gigshield_token";

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!isLoggedIn()) return null;
  try {
    return await authApi.me();
  } catch {
    clearToken();
    return null;
  }
}

export function logout(): void {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

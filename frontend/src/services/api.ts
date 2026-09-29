import type { AnalysisResult, DatasetStats, UserProfile } from "../types";

const TOKEN_KEY = "ancient_tamil_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function analyzeInscription(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Analysis failed on server");
  }

  return res.json();
}

export async function getAnalysisHistory(): Promise<AnalysisResult[]> {
  const res = await fetch("/api/history", {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load history");
  }

  return res.json();
}

export async function getAnalysisById(id: string): Promise<AnalysisResult> {
  const res = await fetch(`/api/analysis/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Analysis record not found");
  }

  return res.json();
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`/api/analysis/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete analysis");
  }
}

export async function fetchDatasetStats(): Promise<DatasetStats> {
  const res = await fetch("/api/dataset/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch dataset statistics");
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<{ user: UserProfile; access_token: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function signupUser(name: string, email: string, password: string): Promise<{ user: UserProfile; access_token: string }> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Signup failed");
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      clearToken();
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

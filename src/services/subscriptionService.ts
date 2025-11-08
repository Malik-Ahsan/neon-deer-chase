const API_URL = import.meta.env.VITE_API_URL;

import { getToken } from "./authService";

export const upgradeSubscription = async (tierId: 'pro' | 'proplus') => {
  const token = getToken();
  const response = await fetch(`${API_URL}/subscriptions/upgrade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tierId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to upgrade subscription" }));
    throw new Error(errorData.detail || "Failed to upgrade subscription");
  }

  return response.json();
};
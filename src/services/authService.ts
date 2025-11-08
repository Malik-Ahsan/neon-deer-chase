const API_URL = "http://localhost:8000/api/v1/auth";

export const register = async (userData: any) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const login = async (userData: any) => {
  const formData = new URLSearchParams();
  formData.append('username', userData.username);
  formData.append('password', userData.password);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(errorData.detail || "Login failed");
  }
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    const user = { ...data.user, subscriptionTier: data.user.subscriptionTier || 'free' };
    localStorage.setItem("user", JSON.stringify(user));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};
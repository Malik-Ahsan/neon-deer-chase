const API_URL = import.meta.env.VITE_API_URL;

import { getToken } from "./authService";

export const uploadMasterResume = async (file: File) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/resumes/master`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(errorData.detail || "Upload failed");
  }

  return response.json();
};
export const saveMasterResume = async (resumeText: string) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/master`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: resumeText }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Save failed" }));
    throw new Error(errorData.detail || "Save failed");
  }

  return response.json();
};

export const getMasterResume = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/master`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch master resume" }));
    throw new Error(errorData.detail || "Failed to fetch master resume");
  }

  return response.json();
};
export const generateResumeVersion = async (jobDescription: string, versionName: string) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/versions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_description: jobDescription, version_name: versionName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to generate resume version" }));
    throw new Error(errorData.detail || "Failed to generate resume version");
  }

  return response.json();
};

export const getResumeVersions = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/versions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch resume versions" }));
    throw new Error(errorData.detail || "Failed to fetch resume versions");
  }

  return response.json();
};

export const updateResumeVersion = async (versionId: string, resumeContent: string) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/versions/${versionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: resumeContent }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to update resume version" }));
    throw new Error(errorData.detail || "Failed to update resume version");
  }

  return response.json();
};
export const syncResumeVersion = async (versionId: string) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/versions/${versionId}/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to sync resume version" }));
    throw new Error(errorData.detail || "Failed to sync resume version");
  }

  return response.json();
};
export const getExperienceEntries = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/master/experience`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch experience entries" }));
    throw new Error(errorData.detail || "Failed to fetch experience entries");
  }

  return response.json();
};

export const updateExperienceTags = async (experienceEntries: any) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resumes/master/experience/tags`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ experience: experienceEntries }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to update tags" }));
    throw new Error(errorData.detail || "Failed to update tags");
  }

  return response.json();
};
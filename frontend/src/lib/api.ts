const API_BASE_URL = "http://localhost:5001/api";

export async function getCase(caseId: string) {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch case");
  }

  return response.json();
}

export async function getInvestigation(caseId: string) {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/investigate`);

  if (!response.ok) {
    throw new Error("Failed to fetch investigation");
  }

  return response.json();
}

export async function getEvidence(caseId: string) {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/evidence`);

  if (!response.ok) {
    throw new Error("Failed to fetch evidence");
  }

  return response.json();
}

export async function getLessons(caseId: string) {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/learn`);

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return response.json();
}

export async function submitCode(caseId: string, code: string) {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit code");
  }

  return response.json();
}

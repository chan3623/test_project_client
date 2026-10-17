const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function sendChatMessage({ message, sessionId, files = [] }) {
  const formData = new FormData();

  formData.append("message", message);
  formData.append("thread_id", sessionId);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE_URL}/v1/chat`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(errorData.detail || `요청 실패: HTTP ${response.status}`);
  }

  // console.log("response : ", await response.json());

  return response.json();
}

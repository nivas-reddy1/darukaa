const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export async function sendChatMessage(message) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed with ${res.status}`);
  }

  return res.json(); // { reply: string }
}

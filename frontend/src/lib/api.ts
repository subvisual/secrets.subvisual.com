const API_URL = import.meta.env.VITE_API_URL;
export type fetchType = (
  info: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

export async function createSecret(
  {
    secret,
    expiry,
  }: {
    secret: string;
    expiry: number;
  },
  fetch: fetchType = globalThis.fetch
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/secrets`, {
      method: "POST",
      body: JSON.stringify({ secret, expiry }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();

    if (!body.room_id) {
      throw new Error("Response JSON does not contain room_id");
    }

    return body.room_id;
  } catch (error) {
    console.error("Error in createSecret:", error);
    throw error;
  }
}

export async function checkIfRoomExists(
  room: string,
  fetch = globalThis.fetch
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/secrets/${room}`, {
      method: "HEAD",
    });
    return response.status === 200;
  } catch (error) {
    throw "No room available!";
  }
}

export async function getRoomSecret(
  room: string,
  fetch = globalThis.fetch
): Promise<string> {
  let response, body;
  try {
    response = await fetch(`${API_URL}/api/secrets/${room}`, { method: "GET" });
    body = await response.json();
  } catch (error) {
    throw "Something exploded!";
  }

  if (response.status === 404) throw "No such secret!";
  else if (response.status !== 200) throw "Something exploded!";

  return body.secret;
}

export async function deleteSecret(
  room: string,
  fetch = globalThis.fetch
): Promise<void> {
  try {
    await fetch(`${API_URL}/api/secrets/${room}`, { method: "DELETE" });
  } catch (error) {
    throw "Something exploded!";
  }
}

export async function getStats(
  fetch = globalThis.fetch
): Promise<{ secretsCounter: string }> {
  try {
    const response = await fetch(`${API_URL}/api/stats`);
    const json = await response.json();

    return { secretsCounter: json.secrets_counter };
  } catch (error) {
    throw "Something exploded!";
  }
}

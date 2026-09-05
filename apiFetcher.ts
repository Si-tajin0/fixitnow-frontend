const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fixitnow-backend-assignment4.vercel.app";

export const proxy = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Proxy Error:", errorMessage);
    return { status: 500, ok: false, data: { message: errorMessage } };
  }
};

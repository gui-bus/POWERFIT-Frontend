const getBody = async <T>(response: Response): Promise<T | null> => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const getUrl = (contextUrl: string): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiBaseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return contextUrl;
  }

  const baseUrl = apiBaseUrl.endsWith("/")
    ? apiBaseUrl.slice(0, -1)
    : apiBaseUrl;
  
  const normalizedContextUrl = contextUrl.startsWith("/")
    ? contextUrl
    : `/${contextUrl}`;

  return `${baseUrl}${normalizedContextUrl}`;
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const _cookies = await cookies();
    return {
      ...headers,
      cookie: _cookies.toString(),
    };
  }
  return headers || {};
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  const response = await fetch(requestUrl, requestInit);
  const data = await getBody(response);

  return {
    status: response.status,
    data,
    headers: response.headers,
  } as T;
};

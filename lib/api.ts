type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

interface ApiOptions {
  method?: RequestMethod
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

export async function apiRequest<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Set default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Add authorization header if token exists
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  // Merge default headers with custom headers
  const mergedHeaders = { ...defaultHeaders, ...headers }

  // Create request options
  const requestOptions: RequestInit = {
    method,
    headers: mergedHeaders,
  }

  // Add body if it exists
  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  // Make request
  const response = await fetch(url, requestOptions)

  // Parse response
  const data = await response.json()

  // Handle error
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data as T
}


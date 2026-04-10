import axios from 'axios';

const ALLOWED_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head'];
const MAX_TIMEOUT_MS = 60_000;

const getAllowedHosts = () => {
  const value = process.env.PROXY_ALLOWED_HOSTS;
  if (!value) return [];
  return value
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
};

const isProduction = process.env.NODE_ENV === 'production';
const proxyAllowOpen = () => process.env.PROXY_ALLOW_OPEN === 'true';

export const assertProxyAllowedForHost = (hostname: string) => {
  const allowedHosts = getAllowedHosts();
  if (allowedHosts.length > 0) {
    if (!allowedHosts.includes(hostname.toLowerCase())) {
      return {
        ok: false as const,
        message: 'Target host is not permitted for proxying',
      };
    }
    return { ok: true as const };
  }
  if (isProduction && !proxyAllowOpen()) {
    return {
      ok: false as const,
      message:
        'Proxy host allowlist is not configured. Set PROXY_ALLOWED_HOSTS (comma-separated hostnames). For emergencies only, set PROXY_ALLOW_OPEN=true.',
    };
  }
  return { ok: true as const };
};

export type OutboundHttpResult =
  | { success: true; status: number; data: unknown; headers?: unknown }
  | { success: false; status?: number; message: string };

/**
 * Server-side HTTP call with the same host allowlist rules as /api/proxy.
 */
export async function performOutboundHttp(options: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: unknown;
  timeoutMs?: number;
  /** When true, skips PROXY_ALLOWED_HOSTS (caller must enforce its own allowlist). */
  skipHostAssert?: boolean;
}): Promise<OutboundHttpResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(options.url);
  } catch {
    return { success: false, message: 'Invalid URL provided' };
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return { success: false, message: 'Only HTTP/HTTPS protocols are allowed' };
  }

  if (!options.skipHostAssert) {
    const hostCheck = assertProxyAllowedForHost(parsedUrl.hostname);
    if (!hostCheck.ok) {
      return { success: false, message: hostCheck.message };
    }
  }

  const method = (options.method || 'get').toLowerCase();
  if (!ALLOWED_METHODS.includes(method)) {
    return {
      success: false,
      message: `HTTP method ${method.toUpperCase()} is not allowed`,
    };
  }

  const timeout = Math.min(
    Math.max(options.timeoutMs ?? 10_000, 1),
    MAX_TIMEOUT_MS
  );

  const axiosConfig = {
    method,
    url: parsedUrl.toString(),
    timeout,
    headers: { ...(options.headers || {}) },
    data:
      method === 'get' || method === 'head' || method === 'delete'
        ? undefined
        : options.data,
  };

  try {
    const response = await axios(axiosConfig as unknown as Parameters<typeof axios>[0]);
    return {
      success: true,
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const status = err.response?.status;
    const message =
      err.response?.data?.message || err.message || 'HTTP request failed';
    return { success: false, status, message };
  }
}

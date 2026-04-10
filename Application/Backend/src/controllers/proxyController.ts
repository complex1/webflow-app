import { Request, Response } from 'express';
import { performOutboundHttp } from '../utils/outboundHttp';

const ALLOWED_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head'];

export const executeProxyRequest = async (req: Request, res: Response) => {
  try {
    const axiosConfig = req.body as Record<string, unknown>;

    if (!axiosConfig?.url || typeof axiosConfig.url !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'URL is required in the axios config',
      });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(axiosConfig.url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL provided',
      });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: 'Only HTTP/HTTPS protocols are allowed',
      });
    }

    const method = (
      typeof axiosConfig.method === 'string' ? axiosConfig.method : 'get'
    ).toLowerCase();
    if (!ALLOWED_METHODS.includes(method)) {
      return res.status(400).json({
        success: false,
        message: `HTTP method ${method.toUpperCase()} is not allowed`,
      });
    }

    const headersRaw = axiosConfig.headers;
    const headers: Record<string, string> = {};
    if (headersRaw && typeof headersRaw === 'object' && !Array.isArray(headersRaw)) {
      for (const [k, v] of Object.entries(headersRaw as Record<string, unknown>)) {
        if (v !== undefined && v !== null) headers[k] = String(v);
      }
    }

    let data: unknown = axiosConfig.data;
    if (method === 'get' || method === 'head') {
      data = undefined;
    }

    const timeoutRaw = axiosConfig.timeout;
    const timeoutMs =
      typeof timeoutRaw === 'number' && Number.isFinite(timeoutRaw)
        ? timeoutRaw
        : 10_000;

    const result = await performOutboundHttp({
      url: parsedUrl.toString(),
      method,
      headers,
      data,
      timeoutMs,
    });

    if (!result.success) {
      return res.status(result.status || 502).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(result.status).json({
      success: true,
      status: result.status,
      headers: result.headers,
      data: result.data,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Proxy execution error:', err.message);
    return res.status(500).json({
      success: false,
      message: err.message || 'Proxy request failed',
    });
  }
};

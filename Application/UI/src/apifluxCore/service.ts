import { http } from '@/services/http';

/** POST path under `/api` (default `/proxy` = authenticated app proxy). */
let proxyPostPath = '/proxy';

/** Used by Example Playground to call `/proxy/playground` without signing in. */
export function configureApiFluxProxyPostPath(path: string) {
  proxyPostPath = path.startsWith('/') ? path : `/${path}`;
}

export const proxyService = {
  request: async (proxyConfig: unknown) => {
    const { data } = await http.post<unknown>(proxyPostPath, proxyConfig);
    return data;
  },
};

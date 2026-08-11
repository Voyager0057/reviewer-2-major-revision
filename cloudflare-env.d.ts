/** Minimal Cloudflare runtime declarations used by the hosting worker. */
interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type D1Database = object;

declare module "cloudflare:workers" {
  export const env: {
    DB?: unknown;
  };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare",
      });
    }

    // Serve static assets
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        return asset;
      }
    } catch {
      // Asset not found, continue to SPA handling
    }

    // For SPA routing, serve index.html for all non-asset requests
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    try {
      const indexAsset = await env.ASSETS.fetch(indexRequest);
      if (indexAsset.status === 200) {
        return indexAsset;
      }
    } catch {
      // Index.html not found
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;

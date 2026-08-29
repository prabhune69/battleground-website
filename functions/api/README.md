# API functions

This directory holds **Cloudflare Pages Functions** — serverless endpoints that
Cloudflare deploys automatically alongside the static site. No build step or
server config is required; any file you place under `functions/` becomes a
route.

## Path-to-URL mapping

The file path under `functions/` maps directly to the request URL:

| File                              | Serves            |
| --------------------------------- | ----------------- |
| `functions/api/enquiry.js`        | `/api/enquiry`    |
| `functions/api/members.js`        | `/api/members`    |
| `functions/api/hello/world.js`    | `/api/hello/world`|
| `functions/api/[id].js`           | `/api/:id` (dynamic segment) |

So a handler at `functions/api/enquiry.js` is reachable at
`https://www.battlegroundfitness.in/api/enquiry`.

## Handler shape

Each file exports a handler per HTTP method it supports —
`onRequestGet`, `onRequestPost`, etc. (or a catch-all `onRequest`):

```js
// functions/api/enquiry.js
export async function onRequestGet(context) {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const data = await context.request.json();
  // ...handle the enquiry...
  return new Response("Received", { status: 201 });
}
```

`context` gives you `request`, `env` (bindings/secrets), `params` (dynamic
route segments), and `waitUntil`.

> No endpoints exist yet — this is scaffolding. Add handlers here when the site
> needs a backend.

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (!body || typeof body.code !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: 'Missing code' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    const origin = (env && env.RUNNER_ORIGIN) ? String(env.RUNNER_ORIGIN) : '';
    if (!origin) {
      return new Response(JSON.stringify({ ok: false, error: 'RUNNER_ORIGIN not configured for Pages Functions' }), { status: 501, headers: { 'content-type': 'application/json' } });
    }
    const url = origin.replace(/\/$/, '') + '/api/run';
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    return new Response(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}

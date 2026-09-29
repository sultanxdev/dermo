import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../src/app';
import { Server } from 'http';

describe('Integration Tests: API Route Protection via requireAuth', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('GET /health should be publicly accessible without session', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.status, 'healthy');
  });

  it('GET /api/v1/doctors should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/doctors`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/clinic should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/clinic`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/services should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/services`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/analytics/overview should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/analytics/overview`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('POST /api/v1/whatsapp/simulator/send should be accessible (public simulation webhook)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/whatsapp/simulator/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+919988771122',
        name: 'Protection Test User',
        message: 'Hello, what services are available?',
      }),
    });
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
  });
});

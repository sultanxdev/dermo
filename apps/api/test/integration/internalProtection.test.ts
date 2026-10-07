import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../src/app';
import { Server } from 'http';

describe('Integration Tests: Internal Admin Routes & Demo Pipeline Protection', () => {
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

  it('GET /api/v1/internal/clinics should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/internal/clinics`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/internal/stats should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/internal/stats`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('GET /api/v1/internal/demo-requests should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/internal/demo-requests`);
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('POST /api/v1/internal/clinics should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${baseUrl}/api/v1/internal/clinics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unprotected Clinic',
        slug: 'unprotected-clinic',
        ownerName: 'Dr. Hack',
        email: 'hack@clinic.in',
        phone: '+919999999999',
      }),
    });
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 401);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'UNAUTHORIZED');
  });

  it('POST /api/v1/demo-requests should reject invalid schema with 400 validation error', async () => {
    const res = await fetch(`${baseUrl}/api/v1/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // Too short (min 2)
        email: 'invalid-email',
      }),
    });
    const json = (await res.json()) as any;
    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
  });
});

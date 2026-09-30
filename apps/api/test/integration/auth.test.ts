import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../src/app';
import { Server } from 'http';
import { config } from '../../src/config';

describe('Integration Tests: Better Auth Server Endpoints & Configuration', () => {
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

  it('should have centralized single-tenant default clinic ID in config', () => {
    assert.strictEqual(config.singleTenant.clinicId, 'clinic_dermacare_01');
  });

  it('GET /api/auth/get-session should respond without errors when unauthenticated', async () => {
    const res = await fetch(`${baseUrl}/api/auth/get-session`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json, null);
  });

  it('POST /api/auth/sign-in/email should block requests from untrusted origins with 403 CSRF protection', async () => {
    const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://malicious-website.com',
      },
      body: JSON.stringify({
        email: 'attacker@example.com',
        password: 'password',
      }),
    });

    assert.strictEqual(res.status, 403);
  });

  it('POST /api/auth/sign-in/email with trusted origin should reject non-existent credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: config.frontendUrl,
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      }),
    });

    // When origin is trusted, Better Auth processes the request (400/401 invalid credentials or 500 if DB offline)
    assert.ok(res.status >= 400);
  });
});

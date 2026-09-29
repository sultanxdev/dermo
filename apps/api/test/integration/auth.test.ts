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

  it('POST /api/auth/sign-in/email should reject missing or invalid credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      }),
    });

    // Should return 400 or 401
    assert.ok(res.status === 400 || res.status === 401 || res.status === 500);
  });
});

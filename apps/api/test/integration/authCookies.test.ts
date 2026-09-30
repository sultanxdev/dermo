import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../../src/app';
import { Server } from 'http';
import { config } from '../../src/config';

describe('Integration Tests: Auth Cookies & CORS Headers', () => {
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

  it('should include CORS credentials and configured origin in response headers', async () => {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        Origin: config.frontendUrl,
      },
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('access-control-allow-origin'), config.frontendUrl);
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true');
  });

  it('should reject unallowed origins from reflecting in CORS headers', async () => {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        Origin: 'http://malicious-site.example.com',
      },
    });

    assert.strictEqual(res.status, 200);
    assert.notStrictEqual(res.headers.get('access-control-allow-origin'), 'http://malicious-site.example.com');
  });

  it('should respond to preflight OPTIONS requests with CORS headers', async () => {
    const res = await fetch(`${baseUrl}/api/v1/doctors`, {
      method: 'OPTIONS',
      headers: {
        Origin: config.frontendUrl,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    assert.strictEqual(res.headers.get('access-control-allow-origin'), config.frontendUrl);
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true');
  });
});

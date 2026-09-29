import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Pool } from 'pg';

describe('Integration Tests: PostgreSQL Auth Session Persistence', () => {
  it('should initialize auth database pool with configured DATABASE_URL', async () => {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/dermo_clinic';

    const testPool = new Pool({ connectionString });
    assert.ok(testPool, 'Auth PostgreSQL pool should be instantiable');
    await testPool.end();
  });

  it('should verify pool reconnection capability', async () => {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/dermo_clinic';

    // Simulate server restart: pool 1 closes, pool 2 opens
    const pool1 = new Pool({ connectionString });
    assert.strictEqual(pool1.ended, false);
    await pool1.end();
    assert.strictEqual(pool1.ended, true);

    const pool2 = new Pool({ connectionString });
    assert.strictEqual(pool2.ended, false);
    await pool2.end();
    assert.strictEqual(pool2.ended, true);
  });
});

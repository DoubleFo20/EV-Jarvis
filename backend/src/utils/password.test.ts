import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password utilities', () => {
  it('hashes and verifies a password without retaining plaintext', async () => {
    const password = 'Correct-Horse-Battery-Staple-42';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword('incorrect-password', hash)).resolves.toBe(false);
  });
});

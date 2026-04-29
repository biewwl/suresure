import { initDB } from '../';

/**
 * Deleta uma conta pelo ID.
 * @param {number|string} accountId
 */
export async function deleteAccount(accountId) {
  const db = await initDB();
  await db.delete('accounts', accountId);
}

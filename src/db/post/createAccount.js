import { initDB } from '../';

/**
 * Cria uma nova conta.
 * @param {Object} data
 * @param {string} data.name
 * @param {number|string} data.initial
 * @param {string} [data.color]
 * @returns {Promise<number>} ID da conta criada
 */
export async function createAccount(data) {
  const db = await initDB();
  const account = {
    name: String(data.name).trim(),
    initial: Number(String(data.initial).replace(/\./g, '').replace(',', '.')) || 0,
    color: data.color || '#ffffff',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await db.add('accounts', account);
}

import { initDB } from '../';

/**
 * Atualiza os dados de uma conta existente.
 * @param {number|string} id
 * @param {Object} data
 * @param {string} data.name
 * @param {number|string} data.initial
 * @param {string} [data.color]
 */
export async function updateAccount(id, data) {
  const db = await initDB();
  const existing = await db.get('accounts', id);
  if (!existing) {
    throw new Error('Conta não encontrada');
  }

  const updatedAccount = {
    ...existing,
    name: String(data.name).trim(),
    initial: Number(String(data.initial).replace(/\./g, '').replace(',', '.')) || 0,
    color: data.color || existing.color || '#ffffff',
    updatedAt: new Date().toISOString(),
  };

  await db.put('accounts', updatedAccount);
  return updatedAccount;
}

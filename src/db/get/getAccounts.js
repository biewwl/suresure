import { initDB } from '../';

/**
 * Retorna todas as contas cadastradas no banco.
 * @returns {Promise<Array>} - Lista de contas
 */
export async function getAccounts() {
  const db = await initDB();
  return await db.getAll('accounts');
}

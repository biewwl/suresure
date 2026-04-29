import { initDB } from '../';

/**
 * Retorna todos os ganhos extras registrados.
 * @returns {Promise<Array>} Lista de ganhos extras
 */
export async function getOtherEarnings() {
  const db = await initDB();
  return await db.getAll('other_earnings');
}

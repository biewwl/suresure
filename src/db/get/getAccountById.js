import { initDB } from '../';

/**
 * Retorna uma conta específica pelo ID.
 * @param {number|string} id - O ID da conta desejada
 * @returns {Promise<Object|undefined>} - Objeto da conta ou undefined se não encontrar
 */
export async function getAccountById(id) {
  const db = await initDB();
  return await db.get('accounts', id);
}

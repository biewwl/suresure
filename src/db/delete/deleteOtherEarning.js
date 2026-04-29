import { initDB } from '../';

/**
 * Deleta um ganho extra pelo ID.
 * @param {number|string} earningId
 */
export async function deleteOtherEarning(earningId) {
  const db = await initDB();
  await db.delete('other_earnings', earningId);
}

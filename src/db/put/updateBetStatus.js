import { initDB } from "..";

/**
 * Atualiza o status de um bilhete (Win/Loss/Refund).
 * @param {number} id - ID do detalhe
 * @param {number|null} winStatus - 1 (Win), 0 (Loss), null (Pendente)
 */
export async function updateBetStatus(id, winStatus) {
  const db = await initDB();
  const detail = await db.get('bet_details', id);
  
  if (detail) {
    detail.win = winStatus;
    detail.updatedAt = new Date().toISOString();
    await db.put('bet_details', detail);
  }
}

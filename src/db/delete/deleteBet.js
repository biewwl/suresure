import { initDB } from '../';

/**
 * Deleta uma operação completa (Bet + Details + MultipleBets)
 * @param {number} betId - O ID da Bet a ser deletada
 */
export async function deleteBet(betId) {
  const db = await initDB();

  // 1. Buscar todos os detalhes da operação
  const details = await db.getAllFromIndex('bet_details', 'betId', betId);

  // 2. Deletar todos os múltiplos (events) associados aos detalhes
  for (const detail of details) {
    const multipleBets = await db.getAllFromIndex('multiple_bets', 'betDetailId', detail.id);
    for (const multipleBet of multipleBets) {
      await db.delete('multiple_bets', multipleBet.id);
    }
    // 3. Deletar o detalhe
    await db.delete('bet_details', detail.id);
  }

  // 4. Deletar a operação (bet) principal
  await db.delete('bets', betId);
}

import { initDB } from '../';
import { getCompleteBet } from './getCompleteBet';

/**
 * Busca uma operação completa (Bet + Details + MultipleBets).
 * @param {number} id - O ID da Bet (Operação)
 */
export async function getBetById(id) {
  const db = await initDB();
  const bet = await db.get('bets', id);
  if (!bet) return null;

  const details = await getCompleteBet(bet);

  return details;
}

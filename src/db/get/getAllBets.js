import { initDB } from '../';
import { getCompleteBet } from './getCompleteBet';

/**
 * Retorna todas as operações completas (Bet + Details + Events) em um array.
 */
export async function getAllBets() {
  const db = await initDB();

  // 1. Buscamos todos os dados de uma vez para evitar múltiplas aberturas de transação
  const [bets] = await Promise.all([
    db.getAll('bets')
  ]);

  // 3. Montamos a estrutura completa processando cada Bet
  const promises = bets.map(async (bet) => {
    return await getCompleteBet(bet);
  });

  // 2. Aguardamos todas serem resolvidas
  const result = await Promise.all(promises);

  // 4. Ordenamos por data de criação (decrescente)
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

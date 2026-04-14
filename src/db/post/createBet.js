import { initDB } from '../';

/**
 * Cria uma nova operação (Bet) no banco de dados.
 * @returns {Promise<number>} - O ID da bet criada
 */
export async function createBet() {
  const db = await initDB();
  
  // Criamos o objeto base da operação
  const newBet = {
    isWithdrawn: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Adicionamos à store 'bets'
  const id = await db.add('bets', newBet);
  return id;
}

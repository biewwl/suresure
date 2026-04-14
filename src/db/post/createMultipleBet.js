import { initDB } from '../';

/**
 * Cria um evento específico dentro de um bilhete.
 * @param {number} betDetailId - O ID do detalhe retornado por createBetDetail
 * @param {Object} eventData - Dados do jogo (event, description, date, hour)
 * @returns {Promise<number>}
 */
export async function createMultipleBet(betDetailId, eventData) {
  const db = await initDB();

  const newEvent = {
    betDetailId, // O elo com o bilhete
    event: eventData.event, // Ex: "Real Madrid x Barcelona"
    market: eventData.market, // Ex: "Ambos Marcam"
    selection: eventData.selection, // Ex: "Sim"
    date: eventData.date,
    hour: eventData.hour,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const id = await db.add('multiple_bets', newEvent);
  return id;
}

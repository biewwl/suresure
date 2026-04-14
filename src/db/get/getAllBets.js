import { initDB } from '../';
import { calculateDetailProfit } from '../helpers/calculateDetailProfit';

/**
 * Retorna todas as operações completas (Bet + Details + Events) em um array.
 */
export async function getAllBets() {
  const db = await initDB();

  // 1. Buscamos todos os dados de uma vez para evitar múltiplas aberturas de transação
  const [bets, allDetails, allEvents] = await Promise.all([
    db.getAll('bets'),
    db.getAll('bet_details'),
    db.getAll('multiple_bets')
  ]);

  // 2. Criamos mapas de agrupamento para associar os filhos aos pais rapidamente
  const eventsByDetailId = allEvents.reduce((acc, event) => {
    if (!acc[event.betDetailId]) acc[event.betDetailId] = [];
    acc[event.betDetailId].push(event);
    return acc;
  }, {});

  const detailsByBetId = allDetails.reduce((acc, detail) => {
    if (!acc[detail.betId]) acc[detail.betId] = [];
    acc[detail.betId].push(detail);
    return acc;
  }, {});

  // 3. Montamos a estrutura completa processando cada Bet
  const result = bets.map((bet) => {
    let totalOperationProfit = 0;
    let totalStake = 0;

    const details = (detailsByBetId[bet.id] || []).map((detail) => {
      const events = eventsByDetailId[detail.id] || [];

      // Cálculos idênticos aos da getBetById
      const profit = calculateDetailProfit(detail);
      totalOperationProfit += profit;
      totalStake += detail.price;

      const potentialReturn = detail.freebet
        ? (detail.price * detail.odd) - detail.price
        : (detail.price * detail.odd);

      return {
        ...detail,
        profit,
        potentialReturn,
        events
      };
    });

    const roi = totalStake > 0 ? (totalOperationProfit / totalStake) * 100 : 0;

    // Exemplo de exibição
    const formattedROI = `${roi.toFixed(2)}%`;
    // Se totalOperationProfit for -50 e Stake 1000, o resultado será -5.00%


    return {
      ...bet,
      totalProfit: totalOperationProfit,
      totalStake,
      formattedROI,
      details
    };
  });

  // 4. Ordenamos por data de criação (decrescente)
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

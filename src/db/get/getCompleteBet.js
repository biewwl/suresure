import { initDB } from "..";
import { calculateDetailProfit } from "../../utils/calculateDetailProfit";

export const getCompleteBet = async (bet) => {
  const db = await initDB();


  const details = await db.getAllFromIndex('bet_details', 'betId', bet.id);

  let totalOperationProfit = 0;
  let totalStake = 0; // Para simplificar, consideramos o valor apostado como o stake total deste detalhe

  const fullDetails = await Promise.all(
    details.map(async (detail) => {
      const events = await db.getAllFromIndex('multiple_bets', 'betDetailId', detail.id);

      // 1. Calculamos o lucro real baseado no status (win/loss)
      const profit = calculateDetailProfit(detail);
      totalOperationProfit += profit;
      if (!detail.freebet) {
        totalStake += detail.price; // Adicionamos o valor apostado ao stake total
      }

      // 2. Lógica de Retorno Potencial (O que acontece se este bilhete ganhar)
      // Se for freebet: (Valor * Odd) - Valor
      // Se for real: (Valor * Odd)
      const potentialReturn = detail.freebet
        ? (detail.price * detail.odd) - detail.price
        : (detail.price * detail.odd);


      return {
        ...detail,
        profit,           // Lucro atual (baseado no resultado)
        potentialReturn, // O que ele renderia se fosse o vencedor
        events,
      };
    })
  );

  // O cálculo real que aceita a dor da perda
  const roi = totalStake > 0 ? (totalOperationProfit / totalStake) * 100 : 0;

  // Exemplo de exibição
  const formattedROI = `${roi.toFixed(2)}%`;
  // Se totalOperationProfit for -50 e Stake 1000, o resultado será -5.00%

  return {
    ...bet,
    totalProfit: totalOperationProfit,
    details: fullDetails,
    totalStake,
    formattedROI
  };
}
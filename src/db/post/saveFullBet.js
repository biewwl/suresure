import { createBet } from "./createBet";
import { createBetDetail } from "./createBetDetail";
import { createMultipleBet } from "./createMultipleBet";

/**
 * Salva uma operação completa: Bet -> Detalhes -> Eventos
 * @param {Object} fullData - Objeto contendo os dados da operação e array de bilhetes
 */
export async function saveFullBet(fullData) {
  try {
    // 1. Cria a "Tip" (Aposta Mestre) e pega o ID
    const betId = await createBet();

    // 2. Percorre os bilhetes (Details)
    for (const detail of fullData.details) {
      // Cria o bilhete vinculado à Bet mestre
      const detailId = await createBetDetail(betId, {
        bookmakerId: detail.bookmakerId,
        price: detail.price,
        accountId: detail.accountId,
        odd: detail.odd,
        freebet: detail.freebet
      });

      // 3. Percorre os eventos desse bilhete específico
      if (detail.events && detail.events.length > 0) {
        for (const event of detail.events) {
          // Cria o evento vinculado ao ID do detalhe que acabou de ser gerado
          await createMultipleBet(detailId, {
            event: event.event,
            market: event.market,
            selection: event.selection,
            date: event.date,
            hour: event.hour
          });
        }
      }
    }

    return betId; // Retorna o ID da operação completa
  } catch (error) {
    console.error("Erro ao salvar operação completa:", error);
    throw error;
  }
}
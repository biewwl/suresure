import { initDB } from '../';

/**
 * Atualiza uma operação existente (Bet + Details + MultipleBets)
 * @param {number} betId - O ID da Bet a ser atualizada
 * @param {Object} formData - Os novos dados da operação
 */
export async function updateBet(betId, formData) {
  const db = await initDB();

  // 1. Buscar todos os detalhes antigos da operação
  const oldDetails = await db.getAllFromIndex('bet_details', 'betId', betId);

  // 2. Deletar todos os multiplos (events) dos detalhes antigos
  for (const detail of oldDetails) {
    const multipleBets = await db.getAllFromIndex('multiple_bets', 'betDetailId', detail.id);
    for (const multipleBet of multipleBets) {
      await db.delete('multiple_bets', multipleBet.id);
    }
  }

  // 3. Deletar os detalhes antigos
  for (const detail of oldDetails) {
    await db.delete('bet_details', detail.id);
  }

  // 4. Atualizar a bet com a data de atualização
  const updatedBet = {
    ...await db.get('bets', betId),
    updatedAt: new Date().toISOString(),
  };
  await db.put('bets', updatedBet);

  // 5. Criar os novos detalhes e multiplos
  for (const detail of formData.details) {
    const newDetail = {
      betId: betId,
      bookmakerId: detail.bookmakerId,
      price: parseFloat(detail.price.replace(/\./g, '').replace(',', '.')),
      accountId: detail.accountId,
      odd: parseFloat(detail.odd.replace(/\./g, '').replace(',', '.')),
      freebet: detail.freebet,
      win: null,
    };

    const detailId = await db.add('bet_details', newDetail);

    // Adicionar os eventos
    for (const event of detail.events) {
      if (!event.isExtraSelection) {
        const newMultipleBet = {
          betDetailId: detailId,
          event: event.event,
          market: event.market,
          selection: event.selection,
          date: event.date,
          hour: event.hour,
        };
        await db.add('multiple_bets', newMultipleBet);
      } else {
        const newMultipleBet = {
          betDetailId: detailId,
          event: event.event,
          market: event.market,
          selection: event.selection,
          date: event.date,
          hour: event.hour,
        };
        await db.add('multiple_bets', newMultipleBet);
      }
    }
  }
}

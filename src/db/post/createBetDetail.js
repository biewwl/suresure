import { initDB } from '../';

/**
 * Cria um detalhe (bilhete) vinculado a uma operação.
 * @param {number} betId - O ID da operação mestre retornada por createBet
 * @param {Object} detailData - Informações do bilhete (bookmakerId, price, odd, etc)
 * @returns {Promise<number>} - O ID do detalhe criado
 */
export async function createBetDetail(betId, detailData) {
  const db = await initDB();

  const newDetail = {
    betId,
    bookmakerId: detailData.bookmakerId,
    accountId: detailData.accountId ? Number(detailData.accountId) : null,
    // Forçamos Number para evitar strings que quebram o cálculo de lucro
    price: Number(detailData.price) || 0,
    odd: Number(detailData.odd) || 0,
    freebet: detailData.freebet || false,
    win: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return await db.add('bet_details', newDetail);
}

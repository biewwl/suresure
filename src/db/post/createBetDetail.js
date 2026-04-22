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
    // Converte de pt-BR (ex: "100,50") para número
    price: parseFloat(detailData.price.replace(/\./g, '').replace(',', '.')),
    odd: parseFloat(detailData.odd.replace(/\./g, '').replace(',', '.')),
    freebet: detailData.freebet || false,
    win: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return await db.add('bet_details', newDetail);
}

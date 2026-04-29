import { initDB } from '../';

/**
 * Cria um novo registro de ganho extra.
 * @param {Object} data
 * @returns {Promise<number>} ID do registro salvo
 */
export async function createOtherEarning(data) {
  const db = await initDB();

  const formattedValue = parseFloat(
    String(data.value)
      .replace(/\./g, '')
      .replace(',', '.')
      .trim() || '0',
  );

  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const newOtherEarning = {
    accountId: Number(data.accountId),
    bookmakerId: data.bookmakerId,
    value: Number.isNaN(formattedValue) ? 0 : formattedValue,
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    date: data.date || defaultDate,
    time: data.time || defaultTime,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  return await db.add('other_earnings', newOtherEarning);
}

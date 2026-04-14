import { initDB } from '../';

/**
 * Cria um novo bônus no sistema.
 * @param {Object} data - Dados do bônus
 * @param {number} [betId] - (Opcional) ID da aposta que gerou o bônus
 * @param {string} [trigger] - (Opcional) 'win', 'loss'
 */
export async function createBonus(data, betId = null, trigger = null) {
  const db = await initDB();

  const newBonus = {
    title: data.title,
    value: parseFloat(data.value),
    requiredAmount: parseFloat(data.requiredAmount || 0), // Rollover total
    remainingAmount: parseFloat(data.requiredAmount || 0), // O que falta rodar
    status: 'active',
    
    // Rastreabilidade
    originBetId: betId, 
    originTrigger: trigger, // Ex: 'loss' (bônus de consolação)
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const id = await db.add('bonuses', newBonus);
  return id;
}

export const getSortedUniqueEvents = (bet) => {
  // 1. Extrai e formata (flatMap)
  const eventsList = (bet?.details || []).flatMap((detail) =>
    (detail.events || []).map((item) => ({
      evento: item.event,
      data: item.date,     // Formato esperado: YYYY-MM-DD
      horario: item.hour,  // Formato esperado: HH:mm
      mercado: item.market,
      escolha: item.selection,
    }))
  );

  // 2. Remove duplicatas (reduce)
  const uniqueEvents = eventsList.reduce((acc, current) => {
    const isDuplicate = acc.find((item) => item.evento === current.evento);
    if (!isDuplicate) {
      return acc.concat([current]);
    }
    return acc;
  }, []);

  // 3. Ordenação (sort) - Do mais próximo para o mais longe
  return uniqueEvents.sort((a, b) => {
    // Criamos objetos de data reais para comparação
    // O replace substitui '-' por '/' se necessário para compatibilidade de browsers
    const dateA = new Date(`${a.data.replace(/-/g, '/')} ${a.horario}`);
    const dateB = new Date(`${b.data.replace(/-/g, '/')} ${b.horario}`);

    return dateA - dateB; // Ordem crescente
  });
};

export const groupBetsByFurthestDate = (bets) => {
  if (!bets || !Array.isArray(bets)) return [];

  // Função auxiliar para encontrar o timestamp mais futuro de uma bet
  const getMaxTimestamp = (bet) => {
    const timestamps = (bet.details || []).flatMap((detail) =>
      (detail.events || []).map((e) => {
        // Se não houver hora, tratamos como 00:00 para não quebrar a lógica
        const time = e.hour || "00:00";
        return new Date(`${e.date.replace(/-/g, '/')} ${time}`).getTime();
      })
    );
    return timestamps.length > 0 ? Math.max(...timestamps) : 0;
  };

  const groups = bets.reduce((acc, bet) => {
    const allDates = (bet.details || []).flatMap((detail) =>
      (detail.events || []).map((e) => e.date)
    );

    if (allDates.length === 0) return acc;

    // A data (string) para a chave do grupo continua sendo a mais futura
    const furthestDate = allDates.sort((a, b) => b.localeCompare(a))[0];

    if (!acc[furthestDate]) {
      acc[furthestDate] = [];
    }

    acc[furthestDate].push(bet);
    return acc;
  }, {});

  // Transforma em Array de Arrays
  return Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0])) // Ordena os grupos (Datas recentes primeiro)
    .map(([date, betsInDate]) => {
      // Ordena as bets dentro deste dia específico
      const sortedBets = betsInDate.sort((betA, betB) => {
        return getMaxTimestamp(betB) - getMaxTimestamp(betA);
      });

      return [date, sortedBets];
    });
};

export const calculateTotalProfit = (tips) => {
  if (!tips || !Array.isArray(tips)) return 0;

  const total = tips.reduce((acc, tip) => {
    // Garante que o valor seja um número, caso venha como string
    const profit = parseFloat(tip.totalProfit) || 0;
    return acc + profit;
  }, 0);

  // Arredonda para 2 casas decimais para evitar dízimas do JS
  return Number(total.toFixed(2));
};

export const calculateTotalSpend = (tips) => {
  if (!tips || !Array.isArray(tips)) return 0;

  const total = tips.reduce((acc, tip) => {
    // Garante que o valor seja um número, caso venha como string
    const profit = parseFloat(tip.totalStake) || 0;
    return acc + profit;
  }, 0);

  // Arredonda para 2 casas decimais para evitar dízimas do JS
  return Number(total.toFixed(2));
};

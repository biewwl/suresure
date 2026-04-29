const formatCurrency = (value) => {
  if (typeof value === 'string') {
    value = parseFloat(value.replace(',', '.'));
  }
  if (isNaN(value)) {
    value = 0;
  }
  return `R$ ${value.toFixed(2)}`.replace('.', ',');
}

const formatDate = (dateStr, timeStr) => {
  // dateStr formato: "yyyy-mm-dd"
  // timeStr formato: "hh:mm"
  // Retorna: [dataPart, timePart] onde dataPart é "Hoje"|"Ontem"|"Amanhã"|"dd/mm" e timePart é "hh:mm"|"Agora"|"Xm"
  
  const isoString = `${dateStr}T${timeStr}:00`;
  const eventDate = new Date(isoString);
  const now = new Date();
  
  // Função helper para obter componentes de data em timezone de Maranhão (UTC-3)
  const getLocalParts = (date) => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Fortaleza', // Maranhão está no fuso de Fortaleza
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(date).reduce((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
    
    return {
      year: parseInt(parts.year),
      month: parseInt(parts.month) - 1, // 0-indexed
      day: parseInt(parts.day),
      hour: parseInt(parts.hour),
      minute: parseInt(parts.minute),
      second: parseInt(parts.second)
    };
  };
  
  const eventParts = getLocalParts(eventDate);
  const nowParts = getLocalParts(now);
  
  // Criar datas normalizadas (sem hora) para comparação
  const eventDateNormalized = new Date(eventParts.year, eventParts.month, eventParts.day);
  const nowDateNormalized = new Date(nowParts.year, nowParts.month, nowParts.day);
  
  const dayDiff = Math.round((eventDateNormalized - nowDateNormalized) / (1000 * 60 * 60 * 24));
  
  // Formatar hora
  const eventTimeStr = `${String(eventParts.hour).padStart(2, '0')}:${String(eventParts.minute).padStart(2, '0')}`;
  const dateLabelStr = `${String(eventParts.day).padStart(2, '0')}/${String(eventParts.month + 1).padStart(2, '0')}`;
  
  // Determinar label de data
  let dateLabel;
  if (dayDiff === 0) {
    dateLabel = 'Hoje';
  } else if (dayDiff === 1) {
    dateLabel = 'Amanhã';
  } else if (dayDiff === -1) {
    dateLabel = 'Ontem';
  } else {
    dateLabel = dateLabelStr;
  }
  
  // Determinar formato de hora/minutos
  let timeLabel;
  
  // Se for o mesmo dia, fazer cálculos especiais
  if (dayDiff === 0) {
    const eventTotalMs = eventParts.hour * 3600000 + eventParts.minute * 60000 + eventParts.second * 1000;
    const nowTotalMs = nowParts.hour * 3600000 + nowParts.minute * 60000 + nowParts.second * 1000;
    const diffMs = eventTotalMs - nowTotalMs;
    
    // Se < 1 minuto E no futuro (0 <= diffMs < 60000)
    if (diffMs >= 0 && diffMs < 60000) {
      timeLabel = 'Agora';
    }
    // Se entre 1 minuto e 1 hora (60000 <= diffMs < 3600000)
    else if (diffMs >= 60000 && diffMs < 3600000) {
      const minutes = Math.round(diffMs / 60000);
      timeLabel = `${minutes}m`;
    }
    // Caso contrário (passado ou > 1 hora)
    else {
      timeLabel = eventTimeStr;
    }
  } else {
    timeLabel = eventTimeStr;
  }
  
  return [dateLabel, timeLabel];
};

const formatDateExtenso = (dateString) => {
  if (!dateString) return "";

  // Ajuste para evitar problemas de fuso horário ao converter string YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  // Diferença em milissegundos convertida para dias
  const diffTime = checkDate - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";

  // Retorna "11 de abril de 2026"
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export { formatCurrency, formatDate, formatDateExtenso };
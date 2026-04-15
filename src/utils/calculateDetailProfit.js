// Função exportada para ser usada em qualquer lugar do sistema
export function calculateDetailProfit(detail) {
  const price = Number(detail.price) || 0;
  const odd = Number(detail.odd) || 0;
  const isFreebet = !!detail.freebet;
  
  if (detail.win === 1) {
    // Se ganhou: Freebet só paga o lucro líquido. Real paga (valor * odd) - custo.
    return isFreebet ? (price * (odd - 1)) : (price * odd - price);
  } else if (detail.win === 0) {
    // Se perdeu: Freebet prejuízo zero. Real prejuízo é o valor apostado.
    return isFreebet ? 0 : -price;
  }
  
  return 0; // Pendente (win === null)
}

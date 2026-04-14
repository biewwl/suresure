export const getStatusBet = (bet) => {
  const havesOpenDetails = bet.details.some((detail) => detail.win === null);
  if (havesOpenDetails) {
    return " --pending";
  }
  const allWon = bet.details.every((detail) => detail.win === 1);
  if ((allWon && bet.details.length > 1) || bet.details.filter((d) => d.win === 1).length > 1) {
    return " --bingo";
  }
  if (bet.totalProfit > 0) {
    return " --won";
  }
  if (bet.totalProfit < 0) {
    return " --lost";
  }
  return " --draw";
};

export const countBingos = (bets) => {
  let bingos = 0;

  bets.forEach((b) => {
    let winCount = 0;
    b.details.forEach((d) => {

      if (d.win === 1 && winCount === 0) {
        winCount += 1;
      } else if (d.win === 1 && winCount === 1) {
        bingos += 1;
        winCount += 1;
      }
    })
  });

  return bingos;
}
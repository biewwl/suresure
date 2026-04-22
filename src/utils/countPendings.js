export const countPendings = (bets) => {
  let pendings = 0;
  bets.forEach((b) => {
    let has = false;
    b.details.forEach((d) => {
      if(d.win === null && !has) {
        pendings += 1;
        has = true;
      }
    })
  });

  return pendings;
};

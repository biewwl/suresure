export const countFreebets = (bets) => {
  let freebets = 0;
  bets.forEach((b) => {
    b.details.forEach((d) => {
      if(d.freebet) {
        freebets += 1;
      }
    })
  });

  return freebets;
};

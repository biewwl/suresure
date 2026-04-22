export const bookmakersWin = (details) => {
  const wins = [];

  details.forEach((e) => {
    if (e.win === 1 && !wins.some((w) => w === e.bookmakerId)) {
      wins.push(e.bookmakerId);
    }
  });

  return wins;
}
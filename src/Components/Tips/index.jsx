import React, { useMemo } from 'react';
import TipCard from '../TipCard';
import './styles/Tips.css';

function Tips({ bets }) {
  const tipCards = useMemo(
    () => bets.map((bet) => <TipCard key={bet.id} bet={bet} />),
    [bets]
  );

  return (
    <section className="tips-container">
      {bets.length === 0 ? (
        <p className="tips-empty">Nenhuma aposta encontrada.</p>
      ) : (
        tipCards
      )}
    </section>
  );
}

export default React.memo(Tips);
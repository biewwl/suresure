import TipCard from '../TipCard';
import './styles/Tips.css';

function Tips({ bets }) {
  return (
    <section className="tips-container">
      {bets.length === 0 ? (
        <p className="tips-empty">Nenhuma aposta encontrada.</p>
      ) : (
        bets.map((bet) => (
          <TipCard key={bet.id} bet={bet} />
        ))
      )}
    </section>
  );
}

export default Tips;
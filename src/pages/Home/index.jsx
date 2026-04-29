import Tips from "../../Components/Tips";
import "./styles/Home.css";
import { useContext, useState, useMemo, useCallback } from "react";
import {
  calculateTotalProfit,
  groupBetsByFurthestDate,
} from "../../utils/sort";
import { formatCurrency, formatDateExtenso } from "../../utils/format";
import { LuChevronUp as ChevronUp, LuChevronDown as ChevronDown } from "react-icons/lu";
import { DataContext } from "../../context/DataContext";

function Home() {
  const [recoilIds, setRecoilIds] = useState([0]);
  const { bets, loading } = useContext(DataContext);

  const groupBets = useMemo(() => groupBetsByFurthestDate(bets), [bets]);

  const handleRecoil = useCallback((id) => {
    setRecoilIds((prev) => {
      if (prev.some((rI) => rI === id)) {
        return prev.filter((rI) => rI !== id);
      }
      return [...prev, id];
    });
  }, []);

  if (loading) return <p>Carregando operações...</p>;

  console.log(bets);
  

  return (
    <div className="home page">

      {groupBets.map(([date, b], i) => {
        const isHide = !recoilIds.some((rI) => rI === i);

        return (
          <div key={date} className="bets-group">
            <span className="bets-group-date">
              {`${formatDateExtenso(date)} (${formatCurrency(calculateTotalProfit(b))})`}
              <div className="bets-group-date-detail"></div>
              <button
                onClick={() => handleRecoil(i)}
                className="bets-group-date-recoil"
                aria-label={isHide ? "Mostrar apostas" : "Ocultar apostas"}
              >
                {isHide ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
              </button>
            </span>
            {!isHide && <Tips bets={b} />}
          </div>
        );
      })}
    </div>
  );
}

export default Home;

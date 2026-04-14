import Tips from "../../Components/Tips";
import "./styles/Home.css";
import { useContext, useState } from "react";
import {
  calculateTotalProfit,
  groupBetsByFurthestDate,
} from "../../utils/sort";
import { formatCurrency, formatDateExtenso } from "../../utils/format";
import { Icon } from "@iconify-icon/react";
import { DataContext } from "../../context/DataContext";

function Home() {
  const [recoilIds, setRecoilIds] = useState([]);
  const { bets, loading } = useContext(DataContext);

  if (loading) return <p>Carregando operações...</p>;

  const groupBets = groupBetsByFurthestDate(bets);

  const handleRecoil = (id) => {
    if (recoilIds.some((rI) => rI === id)) {
      return setRecoilIds(recoilIds.filter((rI) => rI !== id));
    }
    return setRecoilIds([...recoilIds, id]);
  };

  return (
    <div className="home page">
      {groupBets.map(([date, b], i) => {
        const isHide = recoilIds.some((rI) => rI === i);

        return (
          <div key={date} className="bets-group">
            <span className="bets-group-date">
              {`${formatDateExtenso(date)} (${formatCurrency(calculateTotalProfit(b))})`}
              <div className="bets-group-date-detail"></div>
              <button
                onClick={() => handleRecoil(i)}
                className="bets-group-date-recoil"
              >
                {!isHide && (
                  <Icon
                    icon="iconamoon:arrow-up-2-light"
                    width="24"
                    height="24"
                  />
                )}
                {isHide && (
                  <Icon
                    icon="iconamoon:arrow-down-2-light"
                    width="24"
                    height="24"
                  />
                )}
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

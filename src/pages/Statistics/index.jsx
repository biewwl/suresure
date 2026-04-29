import { useContext, useEffect, useMemo, useState } from "react";
import { get } from "../../db/get";
import { DataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/format";
import "./styles/Statistics.css";

function Statistics() {
  const { bets, investment, profit, loading } = useContext(DataContext);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let active = true;

    const loadAccounts = async () => {
      try {
        const loadedAccounts = await get.getAccounts();
        if (active) setAccounts(loadedAccounts || []);
      } catch (error) {
        console.error("Erro ao carregar contas:", error);
      }
    };

    loadAccounts();
    return () => {
      active = false;
    };
  }, []);

  const accountStats = useMemo(() => {
    return accounts
      .map((account) => {
        const spent = bets.reduce((sum, bet) => {
          const accountSpent = (bet.details || []).reduce(
            (detailSum, detail) => {
              if (
                String(detail.accountId) === String(account.id) &&
                !detail.freebet
              ) {
                return detailSum + (detail.price || 0);
              }
              return detailSum;
            },
            0,
          );
          return sum + accountSpent;
        }, 0);

        const percent = investment ? (spent / investment) * 100 : 0;
        const profitShare = profit ? (percent / 100) * profit : 0;

        return {
          id: account.id,
          name: account.name,
          color: account.color,
          spent,
          percent,
          profitShare,
        };
      })
      .sort((a, b) => b.spent - a.spent);
  }, [accounts, bets, investment, profit]);

  if (loading) {
    return <p>Carregando estatísticas...</p>;
  }

  return (
    <main className="statistics-page page">
      <section className="statistics-block">
        <div className="section-title-group">
          <h1>Contribuição por conta</h1>
        </div>

        <div className="accounts-table-wrapper">
          {accountStats.length > 0 ? (
            accountStats.map((item) => (
              <div
                key={item.id}
                className="accounts-table-row"
                // style={{
                //   border: `1px solid ${item.color}`,
                // }}
              >
                <span
                  style={{
                    color: item.color,
                  }}
                  className="accounts-table-row-name"
                >
                  {item.name}
                </span>
                <span className="accounts-table-row-item">
                  <span>Gasto:</span>
                  {formatCurrency(item.spent)}
                </span>
                <span className="accounts-table-row-item --percent" style={{ color: item.color }}>
                  {/* <span>Percentual:</span> */}
                  {item.percent.toFixed(1)}%
                </span>
                <span className="accounts-table-row-item --profit">
                  <span>Lucro:</span>
                  {formatCurrency(item.profitShare)}
                </span>
              </div>
            ))
          ) : (
            <div className="statistics-empty">
              Nenhuma conta com contribuições registradas.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Statistics;

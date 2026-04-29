import React, { createContext, useEffect, useState, useMemo } from "react";
import { get } from "../db/get";
import {
  calculateTotalProfit,
  calculateTotalSpend,
  groupBetsByFurthestDate,
} from "../utils/sort";
import { countFreebets } from "../utils/countFreebets";
import { countBingos } from "../utils/countBingos";
import { countPendings } from "../utils/countPendings";
// import { formatResults } from "../utils/manageData";

// Crie o contexto
export const DataContext = createContext();

// Crie um provedor de contexto
export const DataProvider = ({ children }) => {
  const [bets, setBets] = useState([]);
  const [otherEarnings, setOtherEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, other] = await Promise.all([
          get.getAllBets(),
          get.getOtherEarnings(),
        ]);
        setBets(data);
        setOtherEarnings(other || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const refreshData = () => {
    setRefresh((current) => !current);
  };

  const otherEarningsProfit = useMemo(() => {
    return otherEarnings.reduce((acc, item) => {
      const value = parseFloat(item.value) || 0;
      return acc + value;
    }, 0);
  }, [otherEarnings]);

  const profit = useMemo(
    () => Number((calculateTotalProfit(bets) + otherEarningsProfit).toFixed(2)),
    [bets, otherEarningsProfit],
  );
  const investment = useMemo(() => calculateTotalSpend(bets), [bets]);
  const daysCount = useMemo(() => groupBetsByFurthestDate(bets).length, [bets]);
  const freebetCount = useMemo(() => countFreebets(bets), [bets]);
  const bingoCount = useMemo(() => countBingos(bets), [bets]);
  const pendingCount = useMemo(() => countPendings(bets), [bets]);

  return (
    <DataContext.Provider
      value={{
        bets,
        otherEarnings,
        otherEarningsProfit,
        loading,
        refresh: refreshData,
        profit,
        investment,
        daysCount,
        freebetCount,
        bingoCount,
        pendingCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

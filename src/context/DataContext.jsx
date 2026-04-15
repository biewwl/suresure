import React, { createContext, useEffect, useState, useMemo } from "react";
import { get } from "../db/get";
import { calculateTotalProfit, calculateTotalSpend, groupBetsByFurthestDate } from "../utils/sort";
// import { formatResults } from "../utils/manageData";

// Crie o contexto
export const DataContext = createContext();

// Crie um provedor de contexto
export const DataProvider = ({ children }) => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await get.getAllBets();
        setBets(data);
      } catch (error) {
        console.error("Erro ao carregar apostas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const refreshData = () => {
    setRefresh(!refresh);
  }

  const profit = useMemo(() => calculateTotalProfit(bets), [bets]);
  const investment = useMemo(() => calculateTotalSpend(bets), [bets]);
  const daysCount = useMemo(() => groupBetsByFurthestDate(bets).length, [bets]);

  return (
    <DataContext.Provider value={{ bets, loading, refresh: refreshData, profit, investment, daysCount }}>
      {children}
    </DataContext.Provider>
  );
};

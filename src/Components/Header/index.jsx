import { Link } from "react-router-dom";
import "./styles/Header.css";
import { LuFlame as Star, LuHouse as Home, LuUser as User, LuTicket as Ticket, LuCalculator as Calculator, LuUpload as Upload, LuDownload as Download, LuChartBar as StatsIcon } from "react-icons/lu";
import { formatCurrency } from "../../utils/format";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import BlockInfo from "../BlockInfo";
import { exportDB, importDB } from "../../db";
import { MdCasino } from "react-icons/md";

function Header() {
  const { profit, investment, daysCount, freebetCount, bingoCount, pendingCount } = useContext(DataContext);

  const classProfit = () => {
    if (profit > 0) return " --won";
    if (profit === 0) return "";
    return " --lost";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      importDB(file);
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-left">
        <Star size={30} className="app-header-left-icon" />
        <span className="app-header-left-text">
          <span className="app-header-left-text-1">Sure</span>devil
        </span>
      </div>
      <nav className="app-nav">
        <Link to="/" className="app-nav-item">
          <Home size={18} /> Home
        </Link>
        <Link to="/accounts" className="app-nav-item">
          <User size={18} />
          Contas
        </Link>
        <Link to="/create" className="app-nav-item">
          <Ticket size={18} />
          Criar
        </Link>
        <Link to="/statistics" className="app-nav-item">
          <StatsIcon size={18} />
          Estatísticas
        </Link>
        <Link to="/other-earnings" className="app-nav-item">
          <MdCasino size={18} />
          Extras
        </Link>
        <Link to="https://bettracker.com.br/calculator" target="_blank" className="app-nav-item">
          <Calculator size={18} />
          Calculadora
        </Link>
        <button className="app-nav-item" onClick={exportDB}>
          <Upload size={18} />
          Exportar
        </button>
        <label className="app-nav-item" htmlFor="import">
          <input type="file" name="" id="import" className="header-import" accept=".json" onChange={handleFileUpload} />
          <Download size={18} />
          Importar
        </label>
      </nav>
      <div className="header-finance">
        <BlockInfo
          className={classProfit()}
          label="Lucro"
          value={formatCurrency(profit)}
        />
        <BlockInfo label="Investimento" value={formatCurrency(investment)} />
        <BlockInfo label="Dias" value={daysCount} />
        <BlockInfo label="Apostas Grátis" value={freebetCount} />
        <BlockInfo label="Bingos" value={bingoCount} />
        <BlockInfo label="Pendentes" value={pendingCount} />
      </div>
      {/* <div className="header-finance">
        <span className={`header-finance-profit${classProfit()}`}>
          {}
        </span>
        <span className="header-finance-investment">
          Investimento: {formatCurrency(investment)}
        </span>
      </div> */}
    </header>
  );
}

export default Header;

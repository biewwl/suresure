import { Link } from "react-router-dom";
import "./styles/Header.css";
import { Icon } from "@iconify-icon/react";
import { formatCurrency } from "../../utils/format";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import BlockInfo from "../BlockInfo";
import { exportDB, importDB } from "../../db";

function Header() {
  const { profit, investment, daysCount } = useContext(DataContext);

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
        <Icon
          icon="game-icons:pentacle"
          width="30"
          height="30"
          className="app-header-left-icon"
        />
        <span className="app-header-left-text">
          <span className="app-header-left-text-1">Sure</span>devil
        </span>
      </div>
      <nav className="app-nav">
        <Link to="/" className="app-nav-item">
          <Icon icon="heroicons:home" width="18" height="18" /> Home
        </Link>
        <Link to="/accounts" className="app-nav-item">
          <Icon icon="lucide:user" width="18" height="18" />
          Accounts
        </Link>
        <Link to="/create" className="app-nav-item">
          <Icon icon="famicons:ticket-outline" width="18" height="18" />
          Criar Aposta
        </Link>
        <button className="app-nav-item" onClick={exportDB}>
          <Icon icon="solar:export-linear" width="18" height="18" />
          Exportar
        </button>
        <label className="app-nav-item" htmlFor="import">
          <input type="file" name="" id="import" className="header-import" accept=".json" onChange={handleFileUpload} />
          <Icon icon="solar:import-linear" width="18" height="18" />
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

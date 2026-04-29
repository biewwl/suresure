import { useContext, useEffect, useState } from "react";
import SelectBookmaker from "../../Components/SelectBookmaker";
import { get } from "../../db/get";
import { post } from "../../db/post";
import { remove } from "../../db/delete";
import { getLogo } from "../../utils/getLogo";
import { formatCurrency } from "../../utils/format";
import { DataContext } from "../../context/DataContext";
import { LuX as Close } from "react-icons/lu";
import "../CreateBetPage/styles/CreateBetPage.css";
import "./styles/OtherEarnings.css";

function OtherEarnings() {
  const [accounts, setAccounts] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [isSelectingBookmaker, setIsSelectingBookmaker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const { refresh } = useContext(DataContext);

  const getTodayDate = () => new Date().toISOString().slice(0, 10);

  const [newEarning, setNewEarning] = useState({
    accountId: "",
    bookmakerId: "",
    value: "0,00",
    description: "",
    imageUrl:
      "https://www.marcionomundo.com.br/media/images/0F6DEE3CBBF5.width-660.jpg",
    date: getTodayDate(),
    time: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [loadedAccounts, savedEarnings] = await Promise.all([
          get.getAccounts(),
          get.getOtherEarnings(),
        ]);
        setAccounts(loadedAccounts || []);
        setEarnings(savedEarnings || []);
      } catch (error) {
        console.error("Erro ao carregar contas ou ganhos extras:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrencyInput = (rawValue) => {
    const cleanValue = rawValue.replace(/\D/g, "");
    const cleanCurrentValue = newEarning.value.replace(/\D/g, "");

    let finalDigits = "";
    if (cleanValue.length < cleanCurrentValue.length) {
      finalDigits = cleanCurrentValue.slice(0, -1);
    } else {
      if (cleanValue === cleanCurrentValue) {
        return newEarning.value || "0,00";
      }

      let addedDigit = "";
      for (let i = 0; i < cleanValue.length; i++) {
        if (cleanValue[i] !== cleanCurrentValue[i]) {
          addedDigit = cleanValue[i];
          break;
        }
      }

      if (!addedDigit) {
        addedDigit = cleanValue.slice(-1);
      }

      finalDigits = cleanCurrentValue + addedDigit;
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(finalDigits || 0) / 100);
  };

  const handleFieldChange = (field, value) => {
    if (field === "value") {
      value = formatCurrencyInput(value);
    }
    setNewEarning((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleBookmakerSelect = (bookmakerName) => {
    setNewEarning((current) => ({
      ...current,
      bookmakerId: bookmakerName,
    }));
    setIsSelectingBookmaker(false);
  };

  const resetForm = () => {
    setNewEarning({
      accountId: "",
      bookmakerId: "",
      value: "0,00",
      description: "",
      imageUrl:
        "https://www.marcionomundo.com.br/media/images/0F6DEE3CBBF5.width-660.jpg",
      date: getTodayDate(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });
    setMessage(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!newEarning.bookmakerId) {
      setMessage("Selecione um bookmaker antes de salvar.");
      return;
    }
    if (!newEarning.accountId) {
      setMessage("Selecione uma conta antes de salvar.");
      return;
    }
    if (!newEarning.description.trim()) {
      setMessage("Adicione uma descrição para este ganho extra.");
      return;
    }
    if (!newEarning.date) {
      setMessage("Selecione a data do ganho.");
      return;
    }
    if (!newEarning.time) {
      setMessage("Selecione a hora do ganho.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const id = await post.createOtherEarning({
        accountId: newEarning.accountId,
        bookmakerId: newEarning.bookmakerId,
        value: newEarning.value,
        description: newEarning.description,
        imageUrl: newEarning.imageUrl,
        date: newEarning.date,
        time: newEarning.time,
      });

      setEarnings((current) => [
        ...current,
        {
          ...newEarning,
          id,
        },
      ]);

      resetForm();
      setMessage("Ganho extra salvo com sucesso.");
      refresh();
    } catch (error) {
      console.error("Erro ao salvar ganho extra:", error);
      setMessage("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (entryId) => {
    try {
      await remove.deleteOtherEarning(entryId);
      setEarnings((current) => current.filter((entry) => entry.id !== entryId));
      refresh();
    } catch (error) {
      console.error("Erro ao excluir ganho extra:", error);
      setMessage("Erro ao excluir. Tente novamente.");
    }
  };

  const selectedAccountName =
    accounts.find(
      (account) => String(account.id) === String(newEarning.accountId),
    )?.name || "";

  const imageOptions = Array.from(
    new Set(
      earnings.filter((item) => item.imageUrl).map((item) => item.imageUrl),
    ),
  );

  return (
    <main className="create-bet-page page">
      <section className="other-earnings-page">
        <div className="other-earnings-page-header">
          <h1 className="other-earnings-page-title">Ganhos Extras</h1>
          {isSelectingBookmaker && (
            <SelectBookmaker
              onSelect={handleBookmakerSelect}
              cancel={() => setIsSelectingBookmaker(false)}
            />
          )}
        </div>

        <form className="other-earnings-page-form" onSubmit={handleSave}>
          <div className="other-earnings-page-fields">
            <div className="input-group">
              <label className="input-group-label">Bookmaker</label>
              <div
                className="create-bet-page-tickets-ticket-header-bookmaker bookmaker-selector"
                onClick={() => setIsSelectingBookmaker(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setIsSelectingBookmaker(true)
                }
              >
                {newEarning.bookmakerId ? (
                  <img
                    src={getLogo(newEarning.bookmakerId).logo}
                    alt={newEarning.bookmakerId}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="bookmaker-placeholder">+</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <label className="input-group-label">Conta</label>
              <select
                value={newEarning.accountId}
                onChange={(e) => handleFieldChange("accountId", e.target.value)}
                className="account-input"
              >
                <option value="" hidden>
                  {loading ? "Carregando contas..." : "Selecione uma conta"}
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-group-label">Valor</label>
              <input
                type="tel"
                value={newEarning.value}
                onChange={(e) => handleFieldChange("value", e.target.value)}
                className="input-group-input"
                placeholder="0,00"
              />
            </div>

            <div className="input-group">
              <label className="input-group-label">Descrição</label>
              <input
                type="text"
                value={newEarning.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                className="input-group-input"
                placeholder="Descreva o ganho extra"
              />
            </div>

            <div className="input-group">
              <label className="input-group-label">Data</label>
              <input
                type="date"
                value={newEarning.date}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className="input-group-input"
              />
            </div>
            <div className="input-group">
              <label className="input-group-label">Hora</label>
              <input
                type="time"
                value={newEarning.time}
                onChange={(e) => handleFieldChange("time", e.target.value)}
                className="input-group-input"
              />
            </div>
            <div className="input-group">
              <label className="input-group-label">Imagem (URL)</label>
              <input
                type="url"
                value={newEarning.imageUrl}
                onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                className="input-group-input"
                placeholder="https://..."
              />
            </div>

            <div className="other-earnings-page-preview-panel">
              <div className="other-earnings-page-preview">
                <span className="input-group-label">Preview</span>
                <img
                  src={newEarning.imageUrl}
                  alt="Pré-visualização do ganho"
                />
              </div>
              {imageOptions.length > 0 && (
                <div className="other-earnings-page-image-options">
                  {imageOptions.map((url) => (
                    <button
                      key={url}
                      type="button"
                      className={`image-option-button ${newEarning.imageUrl === url ? "active" : ""}`}
                      onClick={() => handleFieldChange("imageUrl", url)}
                    >
                      <img src={url} alt="Imagem de ganho extra" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="other-earnings-page-actions">
            <button
              type="submit"
              className="ticket-button btn-submit"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar ganho extra"}
            </button>
            <div className="other-earnings-page-note">
              {selectedAccountName &&
                `Conta selecionada: ${selectedAccountName}`}
            </div>
          </div>
          {message && <p className="other-earnings-page-note">{message}</p>}
        </form>

        <div className="other-earnings-page-cards">
          {earnings.length > 0 ? (
            earnings.map((earning) => {
              
              const acc = accounts.find(
                        (account) =>
                          String(account.id) === String(earning.accountId),
                      );

              const accName = acc?.name || "Conta";
              
              return (
              <article key={earning.id} className="other-earnings-page-card">
                <div className="other-earnings-card-header">
                  <div className="other-earnings-card-logo-container">
                    <img
                      src={`${earning.imageUrl}`}
                      alt=""
                      className="other-earnings-card-logo-bg"
                    />
                    <img
                      src={getLogo(earning.bookmakerId).logo}
                      alt={earning.bookmakerId}
                      className="other-earnings-card-logo"
                    />
                  </div>

                  <div className="other-earnings-card-info">
                    <p className="other-earnings-card-description">
                      {earning.description}
                    </p>
                    {/* <span>{earning.bookmakerId}</span> */}
                    <span className="other-earnings-card-logo-account">
                      {accName}
                    </span>
                    
                    <span className="other-earnings-card-value">
                      {formatCurrency(earning.value)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-selection"
                  onClick={() => removeEntry(earning.id)}
                >
                  <Close></Close>
                </button>
              </article>
            )})
          ) : (
            <div className="other-earnings-page-no-data">
              Nenhum ganho extra adicionado ainda.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default OtherEarnings;

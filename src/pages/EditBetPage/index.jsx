import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../db/get";
import { put } from "../../db/put";
import { getAccounts } from "../../db/get";
import "./styles/EditBetPage.css";
import SelectBookmaker from "../../Components/SelectBookmaker";
import { getLogo } from "../../utils/getLogo";
import { DataContext } from "../../context/DataContext";
import { Icon } from "@iconify-icon/react";
import BackButton from "../../Components/BackButton";

function EditBetPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [ticketBookmakerSelection, setTicketBookmakerSelection] =
    useState(null);
  const { refresh } = useContext(DataContext);

  const [formData, setFormData] = useState({
    details: [
      {
        bookmakerId: "",
        price: "0,00",
        accountId: "",
        odd: "0,00",
        freebet: false,
        events: [
          {
            event: "",
            market: "",
            selection: "",
            date: "",
            hour: "",
            isExtraSelection: false,
          },
        ],
      },
    ],
  });

  // --- CARREGAMENTO DOS DADOS ---
  useEffect(() => {
    const loadBetData = async () => {
      try {
        const bet = await get.getBetById(Number(id));
        if (!bet) {
          alert("Operação não encontrada!");
          navigate("/");
          return;
        }

        // Formatar os detalhes para o state do form
        const formattedDetails = bet.details.map((detail) => ({
          bookmakerId: detail.bookmakerId,
          price: new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(detail.price),
          accountId: detail.accountId,
          odd: new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(detail.odd),
          freebet: detail.freebet,
          events: detail.events.map((event) => ({
            event: event.event,
            market: event.market,
            selection: event.selection,
            date: event.date,
            hour: event.hour,
            isExtraSelection: event.isExtraSelection,
          })),
        }));

        setFormData({ details: formattedDetails });
      } catch (error) {
        console.error("Erro ao carregar operação:", error);
        alert("Erro ao carregar operação!");
        navigate("/");
      } finally {
        setPageLoading(false);
      }
    };

    const loadAccounts = async () => {
      try {
        const loadedAccounts = await getAccounts();
        setAccounts(loadedAccounts);
      } catch (error) {
        console.error("Erro ao carregar contas:", error);
      }
    };

    loadBetData();
    loadAccounts();
  }, [id, navigate]);

  // --- HANDLERS ---

  const formatCurrencyInput = (rawValue, detailIndex, field) => {
    const cleanValue = rawValue.replace(/\D/g, "");
    const cleanCurrentValue = (
      formData.details[detailIndex][field] || "0,00"
    ).replace(/\D/g, "");

    let finalDigits = "";

    if (cleanValue.length < cleanCurrentValue.length) {
      finalDigits = cleanCurrentValue.slice(0, -1);
    } else {
      let addedDigit = "";

      for (let i = 0; i < cleanValue.length; i++) {
        if (cleanValue[i] !== cleanCurrentValue[i]) {
          addedDigit = cleanValue[i];
          break;
        }
      }

      if (!addedDigit) addedDigit = cleanValue.slice(-1);
      finalDigits = cleanCurrentValue + addedDigit;
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(finalDigits || 0) / 100);
  };

  const updateField = (detailIndex, eventIndex, field, value) => {
    if (field === "price" || field === "odd") {
      value = formatCurrencyInput(value, detailIndex, field);
    }
    const newData = { ...formData };
    if (eventIndex !== null) {
      newData.details[detailIndex].events[eventIndex][field] = value;
    } else {
      newData.details[detailIndex][field] = value;
    }
    setFormData(newData);
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [
        ...formData.details,
        {
          bookmakerId: "",
          price: "0,00",
          accountId: "",
          odd: "0,00",
          freebet: false,
          events: [
            {
              event: "",
              market: "",
              selection: "",
              date: "",
              hour: "",
              isExtraSelection: false,
            },
          ],
        },
      ],
    });
  };

  const addEvent = (detailIndex) => {
    const newData = { ...formData };
    newData.details[detailIndex].events.push({
      event: "",
      market: "",
      selection: "",
      date: "",
      hour: "",
      isExtraSelection: false,
    });
    setFormData(newData);
  };

  const addSelectionSameEvent = (detailIndex, eventIndex) => {
    const newData = { ...formData };
    const parentEvent = newData.details[detailIndex].events[eventIndex];

    newData.details[detailIndex].events.splice(eventIndex + 1, 0, {
      event: parentEvent.event,
      date: parentEvent.date,
      hour: parentEvent.hour,
      market: "",
      selection: "",
      isExtraSelection: true,
    });
    setFormData(newData);
  };

  const removeEventGroup = (detailIndex, eventIndex) => {
    const newData = { ...formData };
    const events = newData.details[detailIndex].events;

    if (eventIndex === 0 || events.length <= 1) {
      return;
    }

    let removeCount = 1;
    for (let i = eventIndex + 1; i < events.length; i++) {
      if (events[i].isExtraSelection) {
        removeCount += 1;
      } else {
        break;
      }
    }

    events.splice(eventIndex, removeCount);
    setFormData(newData);
  };

  const removeEvent = (detailIndex, eventIndex) => {
    const newData = { ...formData };
    const eventItem = newData.details[detailIndex].events[eventIndex];

    if (!eventItem?.isExtraSelection) {
      return;
    }

    if (newData.details[detailIndex].events.length > 1) {
      newData.details[detailIndex].events.splice(eventIndex, 1);
      setFormData(newData);
    }
  };

  const removeDetail = (detailIndex) => {
    if (formData.details.length <= 1) {
      alert("Você deve manter pelo menos um bilhete!");
      return;
    }
    const newData = { ...formData };
    newData.details.splice(detailIndex, 1);
    setFormData(newData);
  };

  const repeatMarketToNewTicket = (detailIndex, eventIndex) => {
    const newData = { ...formData };
    const current = newData.details[detailIndex].events[eventIndex];
    const detail = newData.details[detailIndex];
    let eventSource = current;

    if (current.isExtraSelection) {
      for (let i = eventIndex - 1; i >= 0; i--) {
        if (!newData.details[detailIndex].events[i].isExtraSelection) {
          eventSource = newData.details[detailIndex].events[i];
          break;
        }
      }
    }

    const newTicket = {
      bookmakerId: "",
      price: "0,00",
      accountId: detail.accountId || "",
      odd: "0,00",
      freebet: false,
      events: [
        {
          event: eventSource.event || "",
          market: current.market || "",
          selection: "",
          date: eventSource.date || "",
          hour: eventSource.hour || "",
          isExtraSelection: false,
        },
      ],
    };

    setFormData({
      ...newData,
      details: [...newData.details, newTicket],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await put.updateBet(Number(id), formData);
      navigate("/");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar.");
    } finally {
      setLoading(false);
      refresh();
    }
  };

  const handleBookmakerSelect = (bookmakerName) => {
    if (ticketBookmakerSelection) {
      updateField(
        ticketBookmakerSelection.detailIndex,
        null,
        "bookmakerId",
        bookmakerName,
      );
      setTicketBookmakerSelection(null);
    }
  };

  if (pageLoading) {
    return (
      <main className="edit-bet-page page">
        <div className="edit-bet-page-loading">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="edit-bet-page page">
      <div className="edit-bet-page-header">
        <BackButton />
        <h1>Editar Operação</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-bet-page-form">
        <div className="edit-bet-page-tickets">
          {formData.details.map((detail, dIdx) => {
            const classFreebet = detail.freebet ? " --freebet" : "";

            return (
              <section key={dIdx} className="edit-bet-page-tickets-ticket">
                <header className="edit-bet-page-tickets-ticket-header">
                  <button
                    type="button"
                    className="edit-bet-page-tickets-ticket-header-bookmaker"
                    onClick={() =>
                      setTicketBookmakerSelection({ detailIndex: dIdx })
                    }
                  >
                    {detail.bookmakerId ? (
                      <img
                        src={getLogo(detail.bookmakerId).logo}
                        alt=""
                        className="edit-bet-page-tickets-ticket-header-bookmaker"
                      />
                    ) : (
                      <Icon icon="ic:sharp-add" width="24" height="24" />
                    )}
                  </button>
                  {ticketBookmakerSelection?.detailIndex === dIdx && (
                    <SelectBookmaker onSelect={handleBookmakerSelect} />
                  )}
                  <label
                    className={`edit-bet-page-tickets-ticket-header-freebet${classFreebet}`}
                  >
                    <input
                      type="checkbox"
                      checked={detail.freebet}
                      onChange={(e) =>
                        updateField(dIdx, null, "freebet", e.target.checked)
                      }
                      className="edit-bet-page-tickets-ticket-header-freebet-input"
                    />
                    <Icon icon="mage:gift" width="14" height="14" /> Freebet
                  </label>
                  {formData.details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetail(dIdx)}
                      className="edit-bet-page-tickets-ticket-header-remove"
                      title="Remover bilhete"
                    >
                      <Icon icon="material-symbols:close" width="18" height="18" />
                    </button>
                  )}
                </header>

                {/* FINANCEIRO */}
                <div className="edit-bet-page-finance">
                  <div className="edit-bet-page-finance-inputs">
                    <input
                      type="tel"
                      placeholder="0.00"
                      value={detail.price}
                      onChange={(e) =>
                        updateField(dIdx, null, "price", e.target.value)
                      }
                      required
                      className="edit-bet-page-finance-inputs-input"
                    />
                    <span className="edit-bet-page-finance-inputs-label">
                      Valor
                    </span>
                  </div>
                  <div className="edit-bet-page-finance-inputs">
                    <input
                      type="tel"
                      placeholder="1.00"
                      value={detail.odd}
                      onChange={(e) =>
                        updateField(dIdx, null, "odd", e.target.value)
                      }
                      required
                      className="edit-bet-page-finance-inputs-input"
                    />
                    <span className="edit-bet-page-finance-inputs-label">
                      Odd Total
                    </span>
                  </div>
                </div>
                <select
                  value={detail.accountId}
                  onChange={(e) =>
                    updateField(dIdx, null, "accountId", e.target.value)
                  }
                  required={accounts.length > 0}
                  className="account-input"
                  id="account"
                >
                  <option value="" hidden>
                    {accounts.length
                      ? "Selecione uma conta"
                      : "Nenhuma conta disponível"}
                  </option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                {/* EVENTOS E SELEÇÕES */}

                {detail.events.map((ev, eIdx) => {
                  if (ev.isExtraSelection) return null;

                  const extraSelections = [];
                  for (let i = eIdx + 1; i < detail.events.length; i++) {
                    if (detail.events[i].isExtraSelection) {
                      extraSelections.push({
                        ...detail.events[i],
                        originalIndex: i,
                      });
                    } else {
                      break;
                    }
                  }

                  const eventClass = eIdx > 0 ? " --aditional" : "";

                  return (
                    <div
                      key={eIdx}
                      className={`edit-bet-page-event${eventClass}`}
                    >
                      {/* CABEÇALHO DO EVENTO */}
                      <div className="edit-bet-page-event-header">
                        <div className="input-group">
                          <label htmlFor="event" className="input-group-label">
                            Evento:
                          </label>
                          <input
                            className="input-group-input"
                            value={ev.event}
                            onChange={(e) =>
                              updateField(dIdx, eIdx, "event", e.target.value)
                            }
                            placeholder="Time A x Time B"
                            id="event"
                            required
                          />
                        </div>
                        <div className="ticket-event-date-hour">
                          <div className="input-group">
                            <label htmlFor="date" className="input-group-label">
                              Data
                            </label>
                            <input
                              type="date"
                              value={ev.date}
                              onChange={(e) =>
                                updateField(dIdx, eIdx, "date", e.target.value)
                              }
                              className="input-group-input"
                              id="date"
                            />
                          </div>
                          <div className="input-group">
                            <label htmlFor="hour" className="input-group-label">
                              Horário
                            </label>
                            <input
                              type="time"
                              value={ev.hour}
                              onChange={(e) =>
                                updateField(dIdx, eIdx, "hour", e.target.value)
                              }
                              className="input-group-input"
                              id="hour"
                            />
                          </div>
                        </div>
                        <div className="action-add-new">
                          <button
                            type="button"
                            onClick={() => addSelectionSameEvent(dIdx, eIdx)}
                            className="btn-add-selection ticket-button"
                            title="Adicionar seleção para este evento"
                          >
                            Adicionar Mercado
                          </button>
                          <button
                            type="button"
                            onClick={() => addEvent(dIdx)}
                            className="btn-add-event ticket-button"
                          >
                            + Adicionar Evento
                          </button>
                        </div>
                        {eIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => removeEventGroup(dIdx, eIdx)}
                            className="btn-remove-event ticket-button"
                            title="Apagar este evento"
                          >
                            <Icon icon="material-symbols:close" width="18" height="18" className="btn-remove-event-icon" />
                          </button>
                        )}
                      </div>
                      {/* LISTA DE SELEÇÕES (O primeiro item + as extras) */}
                      <ol className="edit-bet-page-event-list">
                        {/* Primeira Seleção */}
                        <li className="ticket-selection">
                          <div className="edit-bet-page-selection-row">
                            <input
                              placeholder="Mercado (ex: Gols)"
                              value={ev.market}
                              onChange={(e) =>
                                updateField(
                                  dIdx,
                                  eIdx,
                                  "market",
                                  e.target.value,
                                )
                              }
                              className="input-group-input"
                              required
                            />
                            <input
                              placeholder="Seleção (ex: +2.5)"
                              value={ev.selection}
                              onChange={(e) =>
                                updateField(
                                  dIdx,
                                  eIdx,
                                  "selection",
                                  e.target.value,
                                )
                              }
                              className="input-group-input"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => repeatMarketToNewTicket(dIdx, eIdx)}
                            className="btn-repeat-market"
                            title="Repetir mercado em novo bilhete"
                          >
                            Repetir mercado em novo bilhete
                          </button>
                        </li>
                        {/* Seleções Extras */}
                        {extraSelections.map((extra, sIdx) => (
                          <li
                            key={extra.originalIndex}
                            className="ticket-events ticket-selection"
                          >
                            <div className="edit-bet-page-selection-row">
                              <input
                                placeholder="Mercado"
                                value={extra.market}
                                onChange={(e) =>
                                  updateField(
                                    dIdx,
                                    extra.originalIndex,
                                    "market",
                                    e.target.value,
                                  )
                                }
                                required
                                className="input-group-input"
                              />
                              <input
                                placeholder="Seleção"
                                value={extra.selection}
                                onChange={(e) =>
                                  updateField(
                                    dIdx,
                                    extra.originalIndex,
                                    "selection",
                                    e.target.value,
                                  )
                                }
                                required
                                className="input-group-input"
                              />
                              <div className="market-actions">
                                <button
                                  type="button"
                                  onClick={() =>
                                    repeatMarketToNewTicket(
                                      dIdx,
                                      extra.originalIndex,
                                    )
                                  }
                                  className="btn-repeat-market"
                                  title="Repetir mercado em novo bilhete"
                                >
                                  Repetir mercado em novo bilhete
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeEvent(dIdx, extra.originalIndex)
                                  }
                                  className="btn-remove-selection"
                                >
                                  Excluir Mercado
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        <div className="edit-bet-page-footer">
          <button type="button" onClick={addDetail} className="btn-new-ticket ticket-button">
            + Adicionar Novo Bilhete
          </button>
          <button type="submit" disabled={loading} className="btn-submit ticket-button">
            {loading ? "Atualizando..." : "Atualizar Operação"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditBetPage;

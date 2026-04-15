import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../db/post";
import { getAccounts } from "../../db/get";
import "./styles/CreateBetPage.css";
import SelectBookmaker from "../../Components/SelectBookmaker";
import { getLogo } from "../../utils/getLogo";
import { DataContext } from "../../context/DataContext";
import { Icon } from "@iconify-icon/react";

function CreateBetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [ticketBookmakerSelection, setTicketBookmakerSelection] =
    useState(null); // { detailIndex: bookmakerName }
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

  // --- HANDLERS ---

  const formatCurrencyInput = (rawValue, detailIndex, field) => {
    // 1. Limpa os valores
    const cleanValue = rawValue.replace(/\D/g, "");
    const cleanCurrentValue = (
      formData.details[detailIndex][field] || "0,00"
    ).replace(/\D/g, "");

    let finalDigits = "";

    // Caso 1: Usuário apagou (Backspace)
    if (cleanValue.length < cleanCurrentValue.length) {
      finalDigits = cleanCurrentValue.slice(0, -1);
    }
    // Caso 2: Usuário digitou algo
    else {
      // Pegamos o caractere que foi adicionado.
      // Em vez de confiar na posição do cursor, vamos ver qual dígito
      // apareceu de novo no cleanValue comparado ao cleanCurrentValue.

      let addedDigit = "";

      // Se o valor mudou, o novo dígito é aquele que entrou na string.
      // Para ser fiel à sua ideia de "ignorar o cursor", pegamos o dígito
      // que está na posição onde as strings começam a diferir.
      for (let i = 0; i < cleanValue.length; i++) {
        if (cleanValue[i] !== cleanCurrentValue[i]) {
          addedDigit = cleanValue[i];
          break;
        }
      }

      // Se não achou no meio (digitou no fim), pega o último
      if (!addedDigit) addedDigit = cleanValue.slice(-1);

      // A MÁGICA: Independente de onde o addedDigit foi encontrado,
      // nós o concatenamos ao FINAL do valor antigo.
      finalDigits = cleanCurrentValue + addedDigit;
    }

    // A formatação continua a mesma
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
          price: "",
          accountId: "",
          odd: "",
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

    // Insere a nova seleção logo após a atual, copiando os dados do evento pai
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

    // Não permitir remover o primeiro evento do bilhete
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

    // Não permitir remover a primeira seleção do evento
    if (!eventItem?.isExtraSelection) {
      return;
    }

    if (newData.details[detailIndex].events.length > 1) {
      newData.details[detailIndex].events.splice(eventIndex, 1);
      setFormData(newData);
    }
  };

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const loadedAccounts = await getAccounts();
        setAccounts(loadedAccounts);
      } catch (error) {
        console.error("Erro ao carregar contas:", error);
      }
    };

    loadAccounts();
  }, []);

  const repeatMarketToNewTicket = (detailIndex, eventIndex) => {
    const newData = { ...formData };
    const current = newData.details[detailIndex].events[eventIndex];
    const detail = newData.details[detailIndex];
    let eventSource = current;

    // Se for seleção extra, sempre buscar o evento principal para pegar os dados atualizados (data/hora)
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
      price: "",
      accountId: detail.accountId || "",
      odd: "",
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
      await post.saveFullBet(formData);
      navigate("/");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar.");
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

  console.log(formData);

  return (
    <main className="create-bet-page page">
      {/* <h1>Nova Operação</h1>/ */}

      <form onSubmit={handleSubmit} className="create-bet-page-form">
        <div className="create-bet-page-tickets">
          {formData.details.map((detail, dIdx) => {
            const classFreebet = detail.freebet ? " --freebet" : "";

            return (
              <section key={dIdx} className="create-bet-page-tickets-ticket">
                <header className="create-bet-page-tickets-ticket-header">
                  <button
                    type="button"
                    className="create-bet-page-tickets-ticket-header-bookmaker"
                    onClick={() =>
                      setTicketBookmakerSelection({ detailIndex: dIdx })
                    }
                  >
                    {detail.bookmakerId ? (
                      <img
                        src={getLogo(detail.bookmakerId).logo}
                        alt=""
                        className="create-bet-page-tickets-ticket-header-bookmaker"
                      />
                    ) : (
                      <Icon icon="ic:sharp-add" width="24" height="24" />
                    )}
                  </button>
                  {ticketBookmakerSelection?.detailIndex === dIdx && (
                    <SelectBookmaker onSelect={handleBookmakerSelect} />
                  )}
                  <label
                    className={`create-bet-page-tickets-ticket-header-freebet${classFreebet}`}
                  >
                    <input
                      type="checkbox"
                      checked={detail.freebet}
                      onChange={(e) =>
                        updateField(dIdx, null, "freebet", e.target.checked)
                      }
                      className="create-bet-page-tickets-ticket-header-freebet-input"
                    />
                    <Icon icon="mage:gift" width="14" height="14" /> Freebet
                  </label>
                </header>

                {/* FINANCEIRO */}
                <div className="create-bet-page-finance">
                  <div className="create-bet-page-finance-inputs">
                    <input
                      type="tel"
                      placeholder="0.00"
                      value={detail.price}
                      onChange={(e) =>
                        updateField(dIdx, null, "price", e.target.value)
                      }
                      required
                      className="create-bet-page-finance-inputs-input"
                    />
                    <span className="create-bet-page-finance-inputs-label">
                      Valor
                    </span>
                  </div>
                  <div className="create-bet-page-finance-inputs">
                    <input
                      type="tel"
                      placeholder="1.00"
                      value={detail.odd}
                      onChange={(e) =>
                        updateField(dIdx, null, "odd", e.target.value)
                      }
                      required
                      className="create-bet-page-finance-inputs-input"
                    />
                    <span className="create-bet-page-finance-inputs-label">
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
                  // Se for uma seleção extra, não renderizamos o cabeçalho do evento de novo
                  if (ev.isExtraSelection) return null;
                  // Filtramos as seleções que pertencem a este evento específico (os próximos itens no array que são extras)
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
                      className={`create-bet-page-event${eventClass}`}
                    >
                      {/* CABEÇALHO DO EVENTO */}
                      <div className="create-bet-page-event-header">
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
                            <Icon icon="material-symbols:close" width="18" height="18"  className="btn-remove-event-icon" />
                          </button>
                        )}
                      </div>
                      {/* LISTA DE SELEÇÕES (O primeiro item + as extras) */}
                      <ol className="create-bet-page-event-list">
                        {/* Primeira Seleção */}
                        <li className="ticket-selection">
                          <div className="create-bet-page-selection-row">
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
                            <div className="create-bet-page-selection-row">
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

        <div className="create-bet-page-footer">
          <button type="button" onClick={addDetail} className="btn-new-ticket ticket-button">
            + Adicionar Novo Bilhete
          </button>
          <button type="submit" disabled={loading} className="btn-submit ticket-button">
            {loading ? "Salvando..." : "Finalizar Operação"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateBetPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../db/post";
import { getAccounts } from "../../db/get";
import "./styles/CreateBetPage.css";
import SelectBookmaker from "../../Components/SelectBookmaker";
import { getLogo } from "../../utils/getLogo";

function CreateBetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [ticketBookmakerSelection, setTicketBookmakerSelection] =
    useState(null); // { detailIndex: bookmakerName }

  const [formData, setFormData] = useState({
    details: [
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

  // --- HANDLERS ---

  const updateField = (detailIndex, eventIndex, field, value) => {
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
      console.log(bookmakerName);
    }
    
  };

  return (
    <main className="create-bet-page page">
      <h1>Nova Operação</h1>

      <form onSubmit={handleSubmit}>
        {formData.details.map((detail, dIdx) => (
          <section key={dIdx} className="create-bet-page-section">
            <header>
              <h2>Bilhete #{dIdx + 1}</h2>
              <label>
                <input
                  type="checkbox"
                  checked={detail.freebet}
                  onChange={(e) =>
                    updateField(dIdx, null, "freebet", e.target.checked)
                  }
                />{" "}
                Freebet?
              </label>
            </header>

            {/* FINANCEIRO */}
            <div className="create-bet-page-finance">
              <div>
                <label>Casa de Aposta</label>
                <button
                  type="button"
                  onClick={() =>
                    setTicketBookmakerSelection({ detailIndex: dIdx })
                  }
                >
                  {detail.bookmakerId ? <img src={getLogo(detail.bookmakerId).logo} alt="" /> : "Selecionar"}
                </button>
                {ticketBookmakerSelection?.detailIndex === dIdx && (
                  <SelectBookmaker onSelect={handleBookmakerSelect} />
                )}

                {/* <input placeholder="Ex: Bet365" value={detail.bookmakerId} onChange={(e) => updateField(dIdx, null, 'bookmakerId', e.target.value)} required /> */}
              </div>
              <div>
                <label>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={detail.price}
                  onChange={(e) =>
                    updateField(dIdx, null, "price", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label>Conta</label>
                <select
                  value={detail.accountId}
                  onChange={(e) =>
                    updateField(dIdx, null, "accountId", e.target.value)
                  }
                  required={accounts.length > 0}
                >
                  <option value="">
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
              </div>
              <div>
                <label>Odd Total</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="1.00"
                  value={detail.odd}
                  onChange={(e) =>
                    updateField(dIdx, null, "odd", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* EVENTOS E SELEÇÕES */}
            <div className="create-bet-page-events">
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

                return (
                  <div key={eIdx} className="create-bet-page-event">
                    {/* CABEÇALHO DO EVENTO */}
                    <div className="create-bet-page-event-header">
                      <div>
                        <label>EVENTO</label>
                        <input
                          value={ev.event}
                          onChange={(e) =>
                            updateField(dIdx, eIdx, "event", e.target.value)
                          }
                          placeholder="Time A x Time B"
                          required
                        />
                      </div>
                      <div>
                        <label>DATA</label>
                        <input
                          type="date"
                          value={ev.date}
                          onChange={(e) =>
                            updateField(dIdx, eIdx, "date", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label>HORA</label>
                        <input
                          type="time"
                          value={ev.hour}
                          onChange={(e) =>
                            updateField(dIdx, eIdx, "hour", e.target.value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addSelectionSameEvent(dIdx, eIdx)}
                        className="btn-add-selection"
                        title="Adicionar seleção para este evento"
                      >
                        + Seleção
                      </button>
                      {eIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeEventGroup(dIdx, eIdx)}
                          className="btn-remove-event"
                          title="Apagar este evento"
                        >
                          ✕ Evento
                        </button>
                      )}
                    </div>

                    {/* LISTA DE SELEÇÕES (O primeiro item + as extras) */}
                    <ol className="create-bet-page-event-list">
                      {/* Primeira Seleção */}
                      <li>
                        <div className="create-bet-page-selection-row">
                          <input
                            placeholder="Mercado (ex: Gols)"
                            value={ev.market}
                            onChange={(e) =>
                              updateField(dIdx, eIdx, "market", e.target.value)
                            }
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
                            required
                          />
                          <button
                            type="button"
                            onClick={() => repeatMarketToNewTicket(dIdx, eIdx)}
                            className="btn-repeat-market"
                            title="Repetir mercado em novo bilhete"
                          >
                            Repetir mercado em novo bilhete
                          </button>
                        </div>
                      </li>

                      {/* Seleções Extras */}
                      {extraSelections.map((extra, sIdx) => (
                        <li key={extra.originalIndex}>
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
                            />
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
                              ✕
                            </button>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => addEvent(dIdx)}
              className="btn-add-event"
            >
              + Adicionar Novo Evento Diferente
            </button>
          </section>
        ))}

        <div className="create-bet-page-footer">
          <button type="button" onClick={addDetail} className="btn-new-ticket">
            + Adicionar Novo Bilhete
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Salvando..." : "Finalizar Operação"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateBetPage;

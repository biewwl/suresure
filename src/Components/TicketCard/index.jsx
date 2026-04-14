import React, { useEffect } from "react";
import "./styles/TicketCard.css";
import { formatCurrency, formatDate } from "../../utils/format";
import { getLogo } from "../../utils/getLogo";
import { get } from "../../db/get";
import { Icon } from "@iconify-icon/react";

function TicketCard({ detail, onClick, c }) {
  // Agrupar eventos by event + hora
  const groupedEvents = detail.events.reduce((acc, event) => {
    const key = `${event.event}|${event.hour}`;
    if (!acc[key]) {
      acc[key] = {
        event: event.event,
        date: event.date,
        hour: event.hour,
        selections: [],
      };
    }
    acc[key].selections.push({
      market: event.market,
      selection: event.selection,
    });
    return acc;
  }, {});

  const [account, setAccount] = React.useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        await get
          .getAccountById(detail.accountId)
          .then((res) => setAccount(res));
      } catch (error) {
        console.error("Erro ao buscar conta:", error);
      }
    };
    fetchAccount();
  }, [detail.accountId]);

  console.log(detail);

  const classFreebet = detail.freebet ? " --freebet" : "";
  const classStatus = () => {
    if (detail.profit > 0) return "won";
    if (detail.profit < 0) return "lost";
    return "pending";
  }

  return (
    <section
      className={`ticket-card ticket-card-status-${detail.win === 1 ? "won" : detail.win === 0 ? "lost" : "pending"} ${c || ""} ${classFreebet}`}
      onClick={onClick}
    >
      <div className="ticket-card-header">
        <img
          src={getLogo(detail.bookmakerId)?.logo}
          alt=""
          className="ticket-card-bookmaker"
        />
        <div className="ticket-card-header-info">
          <span className="ticket-card-header-signature">
            {account?.name || detail.bookmakerId}
          </span>
          <span>{detail.createdAt}</span>
        </div>
      </div>

      {/* EVENTOS/JOGOS VINCULADOS A ESTE BILHETE */}
      <div className="ticket-card-events">
        {Object.values(groupedEvents).map((group, idx) => (
          <div key={idx} className="ticket-card-event-group">
            <span className="ticket-card-event-time">
              {formatDate(group.date, group.hour).map((e) => (
                <span key={e}>{e}</span>
              ))}
            </span>
            <div className="ticket-card-selections">
              <p>{group.event}</p>
              {group.selections.map((sel, selIdx) => (
                <div key={selIdx} className="ticket-card-selection">
                  <span className="ticket-card-market">{sel.market} -</span>
                  <span className="ticket-card-selection-value">
                    {sel.selection}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ticket-card-finance">
        <div className="ticket-card-info-box">
          <span className="ticket-card-info-box-text">Investimento:</span>
          <span className="ticket-card-info-box-value --price">
            {detail.freebet && (
                <Icon icon="mage:gift" width="14" height="14" />
            )}
            {formatCurrency(detail.price)}
          </span>
        </div>
        <div className="ticket-card-info-box">
          <span className="ticket-card-info-box-text">Odd:</span>
          <span className="ticket-card-info-box-value">
            {formatCurrency(detail.odd)}
          </span>
        </div>
        <div className="ticket-card-info-box">
          <span className="ticket-card-info-box-text">Retorno Potencial:</span>
          <span className="ticket-card-info-box-value">
            {formatCurrency(detail.potentialReturn)}
          </span>
        </div>
      </div>

      {/* STATUS DO BILHETE */}
      <div
        className={`ticket-card-footer ticket-card-footer-${classStatus()}`}
      >
        {formatCurrency(detail.profit)}
      </div>
    </section>
  );
}

export default TicketCard;

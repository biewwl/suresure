import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "./styles/TipCard.css";
import { formatCurrency, formatDate } from "../../utils/format";
import { getLogo } from "../../utils/getLogo";
import { LuArrowUpRight as ArrowUpRight } from "react-icons/lu";
import { getSortedUniqueEvents } from "../../utils/sort";
import { getStatusBet } from "../../utils/status";

function TipCard({ bet }) {
  const limitBookmakers = 3;
  const limitEvents = 3;

  const uniqueEvents = useMemo(() => getSortedUniqueEvents(bet), [bet]);

  const uniqueEventsLimited = useMemo(
    () => uniqueEvents.slice(0, limitEvents),
    [uniqueEvents]
  );

  const uniqueBookmakers = useMemo(
    () => [...new Set(bet.details.map((detail) => detail.bookmakerId))],
    [bet.details]
  );
  const uniqueBookmakersLimited = useMemo(
    () => uniqueBookmakers.slice(0, limitBookmakers),
    [uniqueBookmakers]
  );

  const formattedEvents = useMemo(
    () =>
      uniqueEventsLimited.map((event) => {
        const [datePart, timePart] = formatDate(event.data, event.horario);
        return { ...event, datePart, timePart };
      }),
    [uniqueEventsLimited]
  );

  const classStatus = useMemo(() => getStatusBet(bet), [bet]);

  return (
    <div className={`tip-card ${classStatus}`}>
      <div className="tip-card-details">
        {formattedEvents.map((event, index) => (
          <div key={index} className="tip-card-event">
            <p className="tip-card-event-title">{event.evento}</p>
            <span className="tip-card-event-date">
              {event.datePart} às {event.timePart}
            </span>
          </div>
        ))}
        {uniqueEvents.length > limitEvents && (
          <span className="tip-card-event-more">
            +{uniqueEvents.length - limitEvents} evento
            {uniqueEvents.length - limitEvents !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="tip-card-bookmakers">
        {uniqueBookmakersLimited.map((bookmakerId) => (
          <Link
            key={bookmakerId}
            to={getLogo(bookmakerId).site}
            target="_blank"
            className="tip-card-bookmaker-link"
          >
            <img
              src={getLogo(bookmakerId).logo}
              alt=""
              className="tip-card-bookmaker-logo"
            />
          </Link>
        ))}
        {uniqueBookmakers.length > limitBookmakers && (
          <span className="tip-card-bookmaker-more">
            +{uniqueBookmakers.length - limitBookmakers}
          </span>
        )}
      </div>
      <ul className="tip-card-finance">
        <li>Valor Gasto: <span className="tip-card-finance-value">{formatCurrency(bet.totalStake)}</span></li>
        <li>Lucro: <span className="tip-card-finance-value">{formatCurrency(bet.totalProfit)}</span></li>
        <li>Arbitragem: <span className="tip-card-finance-value">{bet.formattedROI}</span></li>
      </ul>
      <Link to={`tip/${bet.id}`} className="tip-card-link">
        Detalhes
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

export default React.memo(TipCard);

import React from "react";
import { Link } from "react-router-dom";
import "./styles/TipCard.css";
import { formatCurrency, formatDate } from "../../utils/format";
import { getLogo } from "../../utils/getLogo";
import { Icon } from "@iconify-icon/react";
import { getSortedUniqueEvents } from "../../utils/sort";
import { getStatusBet } from "../../utils/status";

function TipCard({ bet }) {
  const limitBookmakers = 3;
  const limitEvents = 3;

  const uniqueEvents = getSortedUniqueEvents(bet);

  const uniqueEventsLimited = uniqueEvents.slice(0, limitEvents);

  const uniqueBookmakers = [
    ...new Set(bet.details.map((detail) => detail.bookmakerId)),
  ];
  const uniqueBookmakersLimited = uniqueBookmakers.slice(0, limitBookmakers);

  const classStatus = getStatusBet(bet);

  return (
    <div className={`tip-card ${classStatus}`}>
      <div className="tip-card-details">
        {uniqueEventsLimited.map((event, index) => {
          const [datePart, timePart] = formatDate(event.data, event.horario);

          return (
            <div key={index} className="tip-card-event">
              <p className="tip-card-event-title">{event.evento}</p>
              <span className="tip-card-event-date">
                {datePart} às {timePart}
              </span>
            </div>
          );
        })}
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
        <Icon icon="line-md:arrow-up" width="16" height="16" rotate={1} />
      </Link>
    </div>
  );
}

export default TipCard;

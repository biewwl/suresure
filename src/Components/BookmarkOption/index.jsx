import { getLogo } from "../../utils/getLogo";

function BookmakerOption({ onSelect, name }) {
  return (
    <div
      onClick={() => onSelect(name)}
      className="select-bookmaker-option"
    >
      <img
        className="bookmaker-avatar"
        src={getLogo(name).logo}
        alt={name}
        width={50}
        height={50}
      />
      <span className="bookmaker-name">{name}</span>
    </div>
  );
}

export default BookmakerOption;

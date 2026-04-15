import { allLogos } from '../../utils/getLogo';
import BookmakerOption from '../BookmarkOption';
import './styles/SelectBookmaker.css';

function SelectBookmaker({ onSelect, cancel }) {

  const logos = Object.keys(allLogos);

  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget && cancel) {
      cancel();
    }
  };

  return (
    <div className='select-bookmaker-container' onClick={handleContainerClick}>
      <div className="select-bookmaker">
        {logos.map((name) => (
          <BookmakerOption
            key={name}
            name={name}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default SelectBookmaker;

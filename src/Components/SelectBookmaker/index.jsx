import { allLogos } from '../../utils/getLogo';
import BookmakerOption from '../BookmarkOption';
import './styles/SelectBookmaker.css';

function SelectBookmaker({ onSelect }) {

  const logos = Object.keys(allLogos);
  console.log(logos);

  return (
    <div className='select-bookmaker-container'>
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

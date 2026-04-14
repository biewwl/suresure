import { useState, useEffect, useRef } from 'react';
import { getColor } from 'colorthief';
import { getLogo } from '../../utils/getLogo';

function BookmakerOption({ onSelect, name }) {
  const [bgColor, setBgColor] = useState('#f0f0f0'); // Cor padrão inicial
  const imgRef = useRef(null);

  const handleImageLoad = async () => {
    const img = imgRef.current;
    
    // getPalette ou getColor (getColor retorna a cor dominante)
    if (img.complete) {
      const result = await getColor(img);
      console.log(result);
      setBgColor(`rgb(${result._r}, ${result._g}, ${result._b})`);
    }
  };

  

  return (
    <div 
      onClick={() => onSelect(name)} 
      className="select-bookmaker-option"
      style={{ background: `linear-gradient(-30deg, ${bgColor} 0%, transparent 100%)`, transition: 'background 0.3s ease' }}
    >
      <img 
        ref={imgRef}
        className='bookmaker-avatar' 
        src={getLogo(name).logo} 
        alt={name} 
        width={50} 
        height={50}
        onLoad={handleImageLoad}
        crossOrigin="anonymous" // Importante se as imagens vierem de domínios diferentes
      />
      <span>{name}</span>
    </div>
  );
}

export default BookmakerOption;
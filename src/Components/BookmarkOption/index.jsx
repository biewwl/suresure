import { useState, useRef } from "react";
import { getColor } from "colorthief";
import { getLogo } from "../../utils/getLogo";

function BookmakerOption({ onSelect, name }) {
  const [bgColor, setBgColor] = useState("#f0f0f0"); // Cor padrão inicial
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

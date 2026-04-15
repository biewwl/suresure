import { LuArrowLeft as ArrowLeft } from "react-icons/lu";
import "./styles/BackButton.css";

function BackButton() {
  return (
    <button className="back-button" onClick={() => window.history.back()}>
      <ArrowLeft size={16} />
      Voltar
    </button>
  );
}

export default BackButton;
import { Icon } from "@iconify-icon/react";
import "./styles/BackButton.css";

function BackButton() {
  return (
    <button className="back-button" onClick={() => window.history.back()}>
      <Icon icon="line-md:arrow-up" width="16" height="16" rotate={3} />
      Voltar
    </button>
  );
}

export default BackButton;
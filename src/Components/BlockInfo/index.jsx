import "./styles/BlockInfo.css";

function BlockInfo({ value, label, className = "" }) {
  return (
    <div className={`block-info ${className}`}>
      <span className="block-info-label">{label}</span>
      <span className="block-info-value">{value}</span>
    </div>
  );
}

export default BlockInfo;

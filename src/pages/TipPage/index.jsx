import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../../db/get";
import { put } from "../../db/put";
import { remove } from "../../db/delete";
import TicketCard from "../../Components/TicketCard";
import "./styles/TipPage.css";
import { formatCurrency } from "../../utils/format";
import { LuSettings as Settings, LuX as X, LuPencil as Edit2, LuRotateCcw as RotateCcw, LuTrash2 as Trash2 } from "react-icons/lu";
import BackButton from "../../Components/BackButton";
import { DataContext } from "../../context/DataContext";

function TipPage() {
  const { id } = useParams(); // Pega o ID da URL (ex: /tip/12)
  const navigate = useNavigate();
  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDetailIds, setSelectedDetailIds] = useState([]);
  const [isManaging, setIsManaging] = useState(false);
  const { refresh } = useContext(DataContext);

  useEffect(() => {
    async function loadData() {
      try {
        // Buscamos a operação completa com todos os relacionamentos
        const data = await get.getBetById(Number(id));
        if (!data) {
          alert("Operação não encontrada!");
          navigate("/");
          return;
        }
        setBet(data);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="tip-page-container tip-page-loading">
        Carregando detalhes...
      </div>
    );
  if (!bet) return null;

  const handleSelectTicket = (detailId) => {
    if (!isManaging) return; // Só permite seleção se estiver no modo de gerenciamento
    if (selectedDetailIds.includes(detailId)) {
      setSelectedDetailIds(selectedDetailIds.filter((id) => id !== detailId));
    } else {
      setSelectedDetailIds([...selectedDetailIds, detailId]);
    }
  };

  const handleManageClick = () => {
    setIsManaging(!isManaging);
    setSelectedDetailIds([]); // Limpa seleção ao entrar/sair do modo de gerenciamento
  };

  const handleResetStatus = async () => {
    try {
      await Promise.all(
        bet.details.map(
          (detail) => put.updateBetStatus(detail.id, null), // Define como null para pendente
        ),
      );
      const updatedBet = await get.getBetById(Number(id));
      setBet(updatedBet);
      setSelectedDetailIds([]);
      setIsManaging(false);
      refresh();
    } catch (error) {
      console.error("Erro ao redefinir status:", error);
      alert("Ocorreu um erro ao redefinir os status. Tente novamente.");
    }
  };

  const handleAllStatusChange = async (winStatus) => {
    try {
      await Promise.all(
        bet.details.map(
          (detail) => put.updateBetStatus(detail.id, winStatus), // Define o status para todos os detalhes
        ),
      );
      const updatedBet = await get.getBetById(Number(id));
      setBet(updatedBet);
      setSelectedDetailIds([]);
      setIsManaging(false);
      refresh();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Ocorreu um erro ao atualizar os status. Tente novamente.");
    }
  };

  const handleSelectedStatusChange = async (winStatus) => {
    try {
      await Promise.all(
        bet.details
          .filter((detail) => selectedDetailIds.includes(detail.id))
          .map((detail) => put.updateBetStatus(detail.id, winStatus)),
      );
      const updatedBet = await get.getBetById(Number(id));
      setBet(updatedBet);
      setSelectedDetailIds([]);
      setIsManaging(false);
      refresh();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Ocorreu um erro ao atualizar os status. Tente novamente.");
    }
  };

  // se definir como unicas ganhas, deve definir automaticamente as que restaram como perdas, e vice versa. Para isso, passamos como parâmetro os detalhes que não foram selecionados, e definimos o status oposto para eles
  const handleUniqueStatusChange = async (winStatus) => {
    try {
      const remainingDetails = bet.details.filter(
        (detail) => !selectedDetailIds.includes(detail.id),
      );
      await Promise.all([
        ...bet.details
          .filter((detail) => selectedDetailIds.includes(detail.id))
          .map((detail) => put.updateBetStatus(detail.id, winStatus)),
        ...remainingDetails.map((detail) =>
          put.updateBetStatus(detail.id, winStatus === 1 ? 0 : 1),
        ), // Define o status oposto para os detalhes não selecionados
      ]);
      const updatedBet = await get.getBetById(Number(id));
      setBet(updatedBet);
      setSelectedDetailIds([]);
      setIsManaging(false);
      refresh();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Ocorreu um erro ao atualizar os status. Tente novamente.");
    }
  };

  const handleDeleteBet = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar esta operação? Esta ação não pode ser desfeita."
    );

    if (!confirmDelete) return;

    try {
      await remove.deleteBet(Number(id));
      refresh();
      navigate("/");
      alert("Operação deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar operação:", error);
      alert("Ocorreu um erro ao deletar a operação. Tente novamente.");
    }
  };

  return (
    <main
      className={`tip-page-container${isManaging ? " --managing" : ""} page`}
    >
      <section className="tip-page-container-actions">
        <BackButton />
        <button
          className="tip-page-container-actions-btn --manage"
          onClick={handleManageClick}
        >
          {!isManaging ? (
            <>
              <Settings size={16} />
              Entrar no Modo de Gerenciamento
            </>
          ) : (
            <X size={16} />
          )}
        </button>
        {!isManaging && (
          <button
            className="tip-page-container-actions-btn"
            onClick={() => navigate(`/edit/${id}`)}
          >
            <Edit2 size={16} />
            Editar
          </button>
        )}
        {isManaging && (
          <>
            {selectedDetailIds.length > 0 &&
              selectedDetailIds.length < bet.details.length && (
                <>
                  <button
                    className="tip-page-container-actions-btn"
                    onClick={() => handleUniqueStatusChange(1)}
                  >
                    Definir Selecionadas como ÚNICAS Ganhas
                  </button>
                  <button
                    className="tip-page-container-actions-btn"
                    onClick={() => handleUniqueStatusChange(0)}
                  >
                    Definir Selecionadas como ÚNICAS Perdidas
                  </button>
                  <button
                    className="tip-page-container-actions-btn"
                    onClick={() => handleSelectedStatusChange(1)}
                  >
                    Definir Selecionadas como ganhas
                  </button>
                  <button
                    className="tip-page-container-actions-btn"
                    onClick={() => handleSelectedStatusChange(0)}
                  >
                    Definir Selecionadas como perdidas
                  </button>
                </>
              )}
            {(selectedDetailIds.length === 0 ||
              selectedDetailIds.length === bet.details.length) && (
              <>
                <button
                  className="tip-page-container-actions-btn"
                  onClick={() => handleAllStatusChange(1)}
                >
                  Definir TODAS como ganhas
                </button>
                <button
                  className="tip-page-container-actions-btn"
                  onClick={() => handleAllStatusChange(0)}
                >
                  Definir TODAS como perdidas
                </button>
              </>
            )}
            <button
              className="tip-page-container-actions-btn --reset"
              onClick={handleResetStatus}
            >
              <RotateCcw size={15} /> Redefinir
            </button>
            <button className="tip-page-container-actions-btn --delete" onClick={handleDeleteBet}>
              <Trash2 size={16} /> Deletar Operação
            </button>
          </>
        )}
      </section>

      <div className="tip-page-grid">
        {bet.details.map((detail) => (
          <TicketCard
            key={detail.id}
            detail={detail}
            onClick={() => handleSelectTicket(detail.id)}
            c={selectedDetailIds.includes(detail.id) ? "--selected" : ""}
          />
        ))}
      </div>
      <div className="tip-page-footer">
        <div className="tip-page-footer-info">
          <span>
            <span>Total Apostado:</span>{" "}
            <span className="tip-page-footer-info-value">{formatCurrency(bet.totalStake)}</span>
          </span>
          <span>
            <span>ROI:</span> <span className="tip-page-footer-info-value">{bet.formattedROI}</span>
          </span>
          <span>
            <span>Retorno Esperado:</span>{" "}
            <span className="tip-page-footer-info-value">{formatCurrency(bet.details[0].potentialReturn || 0)}</span>
          </span>
          <span>
            <span>Lucro Esperado:</span>{" "}
            <span className="tip-page-footer-info-value">
              {formatCurrency(
                (bet.details[0].potentialReturn || 0) - bet.totalStake,
              )}
            </span>
          </span>
        </div>
        <span
          className={`tip-page-badge-value ${bet.totalProfit >= 0 ? "tip-page-badge-positive" : "tip-page-badge-negative"}`}
        >
          {formatCurrency(bet.totalProfit)}
        </span>
      </div>
    </main>
  );
}

export default TipPage;

import { useEffect, useState } from "react";
import { get } from "../../db/get";
import { post } from "../../db/post";
import { remove } from "../../db/delete";
import "../CreateBetPage/styles/CreateBetPage.css";
import "./styles/Accounts.css";

const initialFormState = {
  name: "",
  initial: "0,00",
  color: "#33ff8f",
};

function formatCurrencyInput(rawValue) {
  const clean = rawValue.replace(/\D/g, "");
  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(clean || 0) / 100);
  return formatted;
}

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const loaded = await get.getAccounts();
      setAccounts(loaded || []);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleFieldChange = (field, value) => {
    if (field === "initial") {
      value = formatCurrencyInput(value);
    }
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEdit = (account) => {
    setEditingId(account.id);
    setForm({
      name: account.name,
      initial: new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(account.initial || 0),
      color: account.color || "#ffffff",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm("Tem certeza de que deseja excluir esta conta?")) {
      return;
    }

    try {
      await remove.deleteAccount(accountId);
      setAccounts((current) => current.filter((account) => account.id !== accountId));
      if (editingId === accountId) {
        setEditingId(null);
        setForm(initialFormState);
      }
      setMessage("Conta excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      setMessage("Não foi possível excluir a conta.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialFormState);
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!form.name.trim()) {
      setMessage("Informe o nome da conta.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await post.updateAccount(editingId, {
          name: form.name,
          initial: form.initial,
          color: form.color,
        });
        setMessage("Conta atualizada com sucesso.");
      } else {
        await post.createAccount({
          name: form.name,
          initial: form.initial,
          color: form.color,
        });
        setMessage("Conta criada com sucesso.");
      }
      resetForm();
      await loadAccounts();
    } catch (error) {
      console.error("Erro ao salvar conta:", error);
      setMessage("Falha ao salvar a conta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="create-bet-page page">
      <section className="accounts-page">
        <div className="accounts-page-header">
          <div>
            <h1 className="accounts-page-title">Contas</h1>
            <p className="accounts-page-note">Crie, edite e exclua suas contas de aposta.</p>
          </div>
          <div className="accounts-page-actions">
            {editingId && (
              <button type="button" className="ticket-button" onClick={resetForm}>
                Cancelar edição
              </button>
            )}
          </div>
        </div>

        <form className="accounts-page-card" onSubmit={handleSubmit}>
          <div className="accounts-page-grid">
            <div className="account-field">
              <label>Nome da conta</label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                placeholder="Ex: Gabriel"
              />
            </div>

            <div className="account-field">
              <label>Saldo inicial</label>
              <input
                type="tel"
                value={form.initial}
                onChange={(event) => handleFieldChange("initial", event.target.value)}
                placeholder="0,00"
              />
            </div>

            <div className="account-field">
              <label>Cor</label>
              <input
                type="color"
                value={form.color}
                onChange={(event) => handleFieldChange("color", event.target.value)}
              />
            </div>
          </div>

          <div className="accounts-page-actions">
            <button type="submit" className="ticket-button btn-submit" disabled={saving}>
              {saving ? "Salvando..." : editingId ? "Atualizar conta" : "Criar conta"}
            </button>
            <span className="accounts-page-note">
              {loading ? "Carregando contas..." : `${accounts.length} contas cadastradas`}
            </span>
          </div>
          {message && <p className="accounts-page-note">{message}</p>}
        </form>

        <div className="account-list">
          {accounts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Saldo inicial</th>
                  <th>Cor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(account.initial || 0)}
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          width: "26px",
                          height: "18px",
                          borderRadius: "4px",
                          backgroundColor: account.color || "#ffffff",
                          border: "1px solid #333",
                        }}
                      />
                    </td>
                    <td>
                      <div className="account-actions">
                        <button
                          type="button"
                          className="ticket-button"
                          onClick={() => handleEdit(account)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-remove-selection"
                          onClick={() => handleDelete(account.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="accounts-page-empty">
              {loading ? "Buscando contas..." : "Nenhuma conta cadastrada."}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Accounts;

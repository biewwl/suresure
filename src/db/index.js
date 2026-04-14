import { openDB } from 'idb';

// 1. Simulação do seu arquivo de dados (ajuste o caminho conforme necessário)
// import { seusDadosPadrao } from './seusDadosPadrao'; 
const defaultAccounts = [
  { name: "Gabriel", initial: 200, color: "#FF5733" },
  { name: "Castiel", initial: 2000, color: "#337aff" },
  { name: "Lucros", initial: 0, color: "#33ff8f" }
];

export const initDB = async () => {
  // Alterado para versão 2 para garantir que o upgrade seja executado
  return openDB('SurebetDB', 1, {
    upgrade(db) {
      // Store de Apostas (Mãe)
      if (!db.objectStoreNames.contains('bets')) {
        db.createObjectStore('bets', { keyPath: 'id', autoIncrement: true });
      }

      // Store de Detalhes (Bilhetes)
      if (!db.objectStoreNames.contains('bet_details')) {
        const store = db.createObjectStore('bet_details', { keyPath: 'id', autoIncrement: true });
        store.createIndex('betId', 'betId');
      }

      // Store de Eventos (Múltiplas)
      if (!db.objectStoreNames.contains('multiple_bets')) {
        const store = db.createObjectStore('multiple_bets', { keyPath: 'id', autoIncrement: true });
        store.createIndex('betDetailId', 'betDetailId');
      }

      // Store de Bônus
      if (!db.objectStoreNames.contains('bonuses')) {
        db.createObjectStore('bonuses', { keyPath: 'id', autoIncrement: true });
      }

      // --- NOVA STORE: ACCOUNTS ---
      if (!db.objectStoreNames.contains('accounts')) {
        const accountStore = db.createObjectStore('accounts', {
          keyPath: 'id',
          autoIncrement: true
        });

        // Inserindo os dados padrão assim que a store é criada
        defaultAccounts.forEach(account => {
          accountStore.add(account);
        });

        console.log('Store "accounts" criada e populada com sucesso!');
      }
    },
  });
};

export const clearDB = async () => {
  const db = await initDB();

  // Lista atualizada de todas as stores para a transação
  const stores = ['bets', 'bet_details', 'multiple_bets', 'bonuses', 'accounts'];

  const tx = db.transaction(stores, 'readwrite');

  // Limpa todas as stores em paralelo
  await Promise.all([
    ...stores.map(storeName => tx.objectStore(storeName).clear())
  ]);

  await tx.done;
  console.log('Banco de dados limpo com sucesso!');
}; 

// Função para Exportar (Backup)
export const exportDB = async () => {
  const db = await initDB();
  const stores = ['bets', 'bet_details', 'multiple_bets', 'bonuses', 'accounts'];
  const allData = {};

  for (const storeName of stores) {
    allData[storeName] = await db.getAll(storeName);
  }

  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_surebet_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Função para Importar (Restore)
export const importDB = async (file) => {
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const db = await initDB();
      const stores = Object.keys(data);

      // Inicia uma transação de escrita para todas as stores
      const tx = db.transaction(stores, 'readwrite');
      
      for (const storeName of stores) {
        const store = tx.objectStore(storeName);
        await store.clear(); // Limpa o que existe antes de restaurar
        
        for (const item of data[storeName]) {
          await store.put(item); // Usa put para manter os IDs originais
        }
      }

      await tx.done;
      alert('Dados restaurados com sucesso! A página será recarregada.');
      window.location.reload();
    } catch (err) {
      console.error("Erro ao importar:", err);
      alert("Arquivo inválido ou erro no processamento.");
    }
  };

  reader.readAsText(file);
};

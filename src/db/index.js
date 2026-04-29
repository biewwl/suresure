import { openDB } from 'idb';

// 1. Simulação do seu arquivo de dados (ajuste o caminho conforme necessário)
// import { seusDadosPadrao } from './seusDadosPadrao'; 
const defaultAccounts = [
  { name: "Gabriel", initial: 200, color: "#FF5733" },
  { name: "Castiel", initial: 2000, color: "#337aff" },
  { name: "Lucros", initial: 0, color: "#33ff8f" }
];

export const initDB = async () => {
  // Aumentamos a versão para 2 para disparar o upgrade
  return openDB('SurebetDB', 2, {
    upgrade(db, oldVersion, newVersion) {
      // ... (suas stores existentes permanecem iguais)
      if (!db.objectStoreNames.contains('bets')) {
        db.createObjectStore('bets', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('bet_details')) {
        const store = db.createObjectStore('bet_details', { keyPath: 'id', autoIncrement: true });
        store.createIndex('betId', 'betId');
      }
      if (!db.objectStoreNames.contains('multiple_bets')) {
        const store = db.createObjectStore('multiple_bets', { keyPath: 'id', autoIncrement: true });
        store.createIndex('betDetailId', 'betDetailId');
      }
      if (!db.objectStoreNames.contains('bonuses')) {
        db.createObjectStore('bonuses', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('accounts')) {
        const accountStore = db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
        defaultAccounts.forEach(account => accountStore.add(account));
      }

      // --- NOVA STORE: OTHER_EARNINGS ---
      if (!db.objectStoreNames.contains('other_earnings')) {
        const otherStore = db.createObjectStore('other_earnings', {
          keyPath: 'id',
          autoIncrement: true
        });
        // Indexamos por accountId (o id da conta que ganhou) e bookmakerId para buscas rápidas
        otherStore.createIndex('accountId', 'accountId');
        otherStore.createIndex('bookmakerId', 'bookmakerId');
      }
    },
  });
};

export const clearDB = async () => {
  const db = await initDB();

  // Lista atualizada de todas as stores para a transação
  // No clearDB, exportDB e importDB, atualize a lista de stores:
  const stores = ['bets', 'bet_details', 'multiple_bets', 'bonuses', 'accounts', 'other_earnings'];

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
  // No clearDB, exportDB e importDB, atualize a lista de stores:
  const stores = ['bets', 'bet_details', 'multiple_bets', 'bonuses', 'accounts', 'other_earnings'];
  const allData = {};

  for (const storeName of stores) {
    allData[storeName] = await db.getAll(storeName);
  }

  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_surebet_${new Date().toISOString().slice(0, 10)}.json`;
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

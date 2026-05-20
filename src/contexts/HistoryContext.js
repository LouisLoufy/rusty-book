import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { createHistoryStore } from '../services/history/historyStore';

const HistoryContext = createContext(null);

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    return {
      records: [],
      isReady: false,
      requiresAuth: false,
      recordVisit: () => {},
      clearHistory: () => {}
    };
  }
  return context;
}

export function HistoryProvider({ children }) {
  const store = useMemo(() => createHistoryStore(), []);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let cancelled = false;
    if (!store.isReady()) {
      return undefined;
    }

    store.getAll().then((list) => {
      if (!cancelled) {
        setRecords(list);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [store]);

  const recordVisit = useCallback(
    (entry) => {
      if (!store.isReady() || !entry?.path || !entry?.title) {
        return;
      }

      const record = {
        path: entry.path,
        title: entry.title,
        categoryId: entry.categoryId || null,
        category: entry.category || null,
        section: entry.section || null,
        visitedAt: Date.now()
      };

      store.add(record).then(setRecords);
    },
    [store]
  );

  const clearHistory = useCallback(() => {
    store.clear().then(() => setRecords([]));
  }, [store]);

  const value = useMemo(
    () => ({
      records,
      isReady: store.isReady(),
      requiresAuth: store.requiresAuth,
      recordVisit,
      clearHistory
    }),
    [records, store, recordVisit, clearHistory]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

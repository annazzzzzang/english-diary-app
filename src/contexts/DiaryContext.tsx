import React, { createContext, useContext, useEffect, useState } from 'react';

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  image?: string;
  musicLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => DiaryEntry | undefined;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const savedEntries = localStorage.getItem('diaryEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (newEntry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const entry: DiaryEntry = {
      ...newEntry,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (id: string, updatedEntry: Partial<DiaryEntry>) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id
          ? { ...entry, ...updatedEntry, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  return (
    <DiaryContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, getEntry }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}; 
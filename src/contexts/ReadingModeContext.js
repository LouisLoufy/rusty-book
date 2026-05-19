import React, { createContext, useContext } from 'react';

const ReadingModeContext = createContext({
  isReadingMode: false,
  isReadonlyMode: false,
  modeSearch: '',
  setReadingMode: () => {},
  toggleReadingMode: () => {}
});

export function ReadingModeProvider({ value, children }) {
  return (
    <ReadingModeContext.Provider value={value}>
      {children}
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode() {
  return useContext(ReadingModeContext);
}

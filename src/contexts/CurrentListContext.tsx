"use client";

// @/contexts/CurrentListContext.tsx

/**
 * Global context for saving and restoring the currently selected List
 * (if any).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {createContext, useCallback, useContext, useMemo, useState} from "react";

// Internal Modules ----------------------------------------------------------

import { List } from "@prisma/client";

// Public Objects ------------------------------------------------------------

interface CurrentListContextProps {
  // Currently selected List
  currentList: List | null;
  // Function to change the currently selected List
  changeCurrentList: (list: List | null) => void;
}

export const CurrentListContext = createContext<CurrentListContextProps>({
  currentList: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeCurrentList: (newCurrentList: List| null) => {},
});

export const CurrentListContextProvider = ({children}: {
  children: React.ReactNode,
}) => {

  const [currentList, setCurrentList] = useState<List | null>(null);
  const changeCurrentList = useCallback((list: List | null) => {
    setCurrentList(list);
  }, []);
  const contextValue = useMemo(() => (
    {currentList, changeCurrentList}),
    [currentList, changeCurrentList]);

  return (
    <CurrentListContext.Provider value={contextValue}>
      {children}
    </CurrentListContext.Provider>
  );
}

export const useCurrentListContext = () => {
  const context = useContext(CurrentListContext);
  if (!context) {
    throw new Error("useCurrentListContext must be used within a CurrentListContextProvider");
  }
  return context;
}

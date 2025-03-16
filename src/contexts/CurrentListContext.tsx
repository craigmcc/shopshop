"use client";

// @/contexts/CurrentListContext.tsx

/**
 * Global context for saving and restoring the currently selected List
 * (if any).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { createContext, useContext, useMemo, useState } from "react";

// Internal Modules ----------------------------------------------------------

import { List } from "@prisma/client";

// Public Objects ------------------------------------------------------------

interface CurrentListContextProps {
  // Currently selected List
  currentList: List | null;
  // Function to change the currently selected List
  setCurrentList: (list: List | null) => void;
}

export const CurrentListContext = createContext<CurrentListContextProps>({
  currentList: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCurrentList: (newCurrentList: List| null) => {},
});

export const CurrentListContextProvider = ({children}: {
  children: React.ReactNode,
}) => {

  const [currentList, setCurrentList] = useState<List | null>(null);
  const memoizedProps = useMemo(() => ({currentList, setCurrentList}), [currentList]);

  return (
    <CurrentListContext.Provider value={memoizedProps}>
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

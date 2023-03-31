import React, { createContext } from "react";

export interface IAppContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppStateContext = createContext<IAppContext>({});

export const AppStateProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <AppStateContext.Provider value={{ open, setOpen }}>
      {children}
    </AppStateContext.Provider>
  );
};

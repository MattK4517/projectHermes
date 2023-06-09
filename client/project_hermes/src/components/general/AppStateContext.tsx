import React, { createContext } from "react";

export interface IAppContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppStateContext = createContext<IAppContext>({
  open: false,
  setOpen: () => {
    return false;
  },
});

export const AppStateProvider: React.FC = ({ children }: any) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <AppStateContext.Provider value={{ open, setOpen }}>
      {children}
    </AppStateContext.Provider>
  );
};

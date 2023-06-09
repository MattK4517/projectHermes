import React, { createContext } from "react";

export interface IAppContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppStateContext = createContext<IAppContext>({
  open: false,
  setOpen: () => {
    return {};
  },
});

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <AppStateContext.Provider value={{ open, setOpen }}>
      {children}
    </AppStateContext.Provider>
  );
};

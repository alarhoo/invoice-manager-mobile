import React, { createContext, useContext, useState } from 'react';
import { clients } from '../mockdata/clients';
import { estimates } from '../mockdata/estimates';
import { invoices } from '../mockdata/invoices';
import { items } from '../mockdata/items';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    items,
    clients,
    estimates,
    invoices,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

/* eslint-disable react/prop-types */
import React, { useState, createContext } from 'react';

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [olasBalances, setOlasBalances] = useState({});

  return (
    <div>
      <DataContext.Provider
        value={{
          provider,
          setProvider,
          web3Provider,
          setWeb3Provider,

          // balances
          olasBalances,
          setOlasBalances,
        }}
      >
        {children}
      </DataContext.Provider>
    </div>
  );
};

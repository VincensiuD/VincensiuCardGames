/* eslint-disable prettier/prettier */
import React, {createContext, useState, useContext, ReactElement} from 'react';

interface iWalletContext {
    money: number;
    setMoney: React.Dispatch<React.SetStateAction<number>>;
}

export const WalletContext = createContext<iWalletContext>({});

type WalletProps = {children: React.ReactElement};

export const WalletProvider = ({children}: WalletProps): ReactElement => {

  const [money, setMoney] = useState<number>(400);

  function getMoneyFromDB(){
    // function to obtain money from DB.
  }

  return (
    <WalletContext.Provider
      value={{
        money,
        setMoney,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

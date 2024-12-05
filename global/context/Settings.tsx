/* eslint-disable prettier/prettier */
import React, {createContext, useState, useContext, ReactElement} from 'react';

interface iSettingsContext {
    play6Cards: boolean;
    setPlay6Cards: React.Dispatch<React.SetStateAction<boolean>>;
    tcpJackpot: boolean;
    setTcpJackpot: React.Dispatch<React.SetStateAction<boolean>>;
    tcpSeparateJackpot: boolean;
    setTcpSeparateJackpot: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsContext = createContext<iSettingsContext>({});

type SettingsProps = {children: React.ReactElement};

export const SettingsProvider = ({children}: SettingsProps): ReactElement => {
  const [play6Cards, setPlay6Cards] = useState<boolean>(false);
  const [tcpJackpot, setTcpJackpot] = useState<boolean>(true);
  const [tcpSeparateJackpot, setTcpSeparateJackpot] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        play6Cards,
        setPlay6Cards,
        tcpJackpot,
        setTcpJackpot,
        tcpSeparateJackpot,
        setTcpSeparateJackpot,
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

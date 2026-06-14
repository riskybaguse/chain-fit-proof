import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const bodyWeightKey = (wallet: string) => `gainchain.bodyWeight.${wallet}`;

type UserContextType = {
  bodyWeight: number | null;
  setBodyWeight: (kg: number) => void;
  walletAddress: string | null;
  isCalibrated: boolean;
};

const UserCtx = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, connected } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;
  const [bodyWeight, setBodyWeightState] = useState<number | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setBodyWeightState(null);
      return;
    }
    const stored = localStorage.getItem(bodyWeightKey(walletAddress));
    setBodyWeightState(stored ? parseFloat(stored) : null);
  }, [walletAddress]);

  const setBodyWeight = useCallback(
    (kg: number) => {
      if (!walletAddress) return;
      localStorage.setItem(bodyWeightKey(walletAddress), String(kg));
      setBodyWeightState(kg);
    },
    [walletAddress],
  );

  return (
    <UserCtx.Provider
      value={{
        bodyWeight,
        setBodyWeight,
        walletAddress,
        isCalibrated: connected && bodyWeight !== null && bodyWeight > 0,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

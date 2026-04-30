import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "solo" | "owner" | "member";

const KEY = "gainchain.role.v1";
const ONBOARD_KEY = "gainchain.onboarding.v1";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
};

const RoleCtx = createContext<Ctx>({ role: "solo", setRole: () => {} });

const readInitial = (): Role => {
  if (typeof window === "undefined") return "solo";
  const direct = localStorage.getItem(KEY);
  if (direct === "solo" || direct === "owner" || direct === "member") return direct;
  try {
    const onb = JSON.parse(localStorage.getItem(ONBOARD_KEY) || "null");
    if (onb?.persona === "owner") return "owner";
    if (onb?.persona === "solo") return "solo";
  } catch {
    /* noop */
  }
  return "solo";
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>("solo");

  useEffect(() => {
    setRoleState(readInitial());
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem(KEY, r);
  };

  return <RoleCtx.Provider value={{ role, setRole }}>{children}</RoleCtx.Provider>;
};

export const useRole = () => useContext(RoleCtx);

export const ROLE_META: Record<Role, { label: string; labelEn: string; chipClass: string }> = {
  solo: {
    label: "ATHLETE",
    labelEn: "ATHLETE",
    chipClass: "bg-primary/15 border-primary/40 text-primary",
  },
  owner: {
    label: "OWNER",
    labelEn: "OWNER",
    chipClass: "bg-owner/15 border-owner/40 text-owner",
  },
  member: {
    label: "MEMBER",
    labelEn: "MEMBER",
    chipClass: "bg-accent/15 border-accent/40 text-accent",
  },
};

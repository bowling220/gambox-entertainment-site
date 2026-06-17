import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, authPersistenceReady, getMemberAdminStatus } from "../lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  admin: boolean;
  adminLoading: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    authPersistenceReady
      .catch(() => undefined)
      .finally(() => {
        if (!active) return;

        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setLoading(false);
        });
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    setAdminLoading(true);
    getMemberAdminStatus(user)
      .then((nextAdmin) => {
        if (active) setAdmin(nextAdmin);
      })
      .catch(() => {
        if (active) setAdmin(false);
      })
      .finally(() => {
        if (active) setAdminLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const value = useMemo(() => ({ user, loading, admin, adminLoading }), [user, loading, admin, adminLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}

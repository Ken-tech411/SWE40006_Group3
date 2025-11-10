"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type UserRole = "customer" | "staff";

type AppUser = {
  uid: string;
  email?: string | null;
  role: UserRole;
  customerId?: number | null;
} | null;

type AuthContextType = {
  user: AppUser;
  setUser: React.Dispatch<React.SetStateAction<AppUser>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        const ref = doc(db, "user", firebaseUser.uid);
        const snapshot = await getDoc(ref);

        let role: UserRole = "customer";
        let customerId: number | null = null;

        if (snapshot.exists()) {
          const data = snapshot.data();
          role = data.role ?? "customer";
          customerId = data.customerId ?? null;
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
          customerId,
        });
      } catch (err) {
        console.error("Load user role failed", err);
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

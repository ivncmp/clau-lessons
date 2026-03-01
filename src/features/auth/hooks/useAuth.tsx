import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "../../../types/storage";
import {
  getActiveUser,
  createUser as createStorageUser,
  setActiveUser as setStorageActiveUser,
  logout as storageLogout,
  deleteUser as storageDeleteUser,
  getAllUsers,
} from "../../../utils/storage";

interface AuthContextValue {
  user: UserProfile | null;
  users: UserProfile[];
  loading: boolean;
  login: (userId: string) => void;
  createUser: (nombre: string, curso: string) => UserProfile;
  logout: () => void;
  deleteUser: (userId: string) => void;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(() => {
    setUsers(getAllUsers());
  }, []);

  useEffect(() => {
    const active = getActiveUser();
    setUser(active?.profile ?? null);
    refreshUsers();
    setLoading(false);
  }, [refreshUsers]);

  const login = useCallback(
    (userId: string) => {
      setStorageActiveUser(userId);
      const active = getActiveUser();
      setUser(active?.profile ?? null);
      refreshUsers();
    },
    [refreshUsers],
  );

  const createNewUser = useCallback(
    (nombre: string, curso: string) => {
      const profile = createStorageUser(nombre, curso);
      setUser(profile);
      refreshUsers();
      return profile;
    },
    [refreshUsers],
  );

  const logout = useCallback(() => {
    storageLogout();
    setUser(null);
  }, []);

  const deleteExistingUser = useCallback(
    (userId: string) => {
      storageDeleteUser(userId);
      if (user?.id === userId) {
        setUser(null);
      }
      refreshUsers();
    },
    [user, refreshUsers],
  );

  const value = useMemo(
    () => ({
      user,
      users,
      loading,
      login,
      createUser: createNewUser,
      logout,
      deleteUser: deleteExistingUser,
      refreshUsers,
    }),
    [
      user,
      users,
      loading,
      login,
      createNewUser,
      logout,
      deleteExistingUser,
      refreshUsers,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login as loginRequest } from "@/features/auth/api/authService";
import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredUser,
  getUserFromToken,
  isJwtExpired,
  setStoredAuth,
} from "@/features/auth/utils/authStorage";
import { AuthContext } from "@/features/auth/context/AuthContextValue";

const emptyAuthState = {
  accessToken: null,
  user: null,
};

const getInitialAuthState = () => {
  const accessToken = getStoredAccessToken();

  if (!accessToken || isJwtExpired(accessToken)) {
    clearStoredAuth();
    return emptyAuthState;
  }

  return {
    accessToken,
    user: getStoredUser() ?? getUserFromToken(accessToken),
  };
};

const isAdminRole = (role) => {
  if (Array.isArray(role)) {
    return role.some(isAdminRole);
  }

  const normalizedRole = String(role ?? "").trim().toLowerCase();
  return normalizedRole === "0" || normalizedRole === "admin";
};

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState(getInitialAuthState);

  const logout = useCallback(() => {
    clearStoredAuth();
    queryClient.clear();
    setAuthState(emptyAuthState);
  }, [queryClient]);

  const login = useCallback(
    async (credentials) => {
      const data = await loginRequest(credentials);
      const accessToken = data?.accessToken ?? data?.token;

      if (!accessToken) {
        throw new Error("May chu khong tra ve access token.");
      }

      const user = data?.user ?? getUserFromToken(accessToken);
      setStoredAuth({ accessToken, user });
      setAuthState({ accessToken, user });
      queryClient.invalidateQueries();

      return { accessToken, user };
    },
    [queryClient]
  );

  useEffect(() => {
    if (authState.accessToken && isJwtExpired(authState.accessToken)) {
      logout();
    }
  }, [authState.accessToken, logout]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (!event.key || event.key.startsWith("taprim_")) {
        setAuthState(getInitialAuthState());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      accessToken: authState.accessToken,
      user: authState.user,
      isAuthenticated: Boolean(authState.accessToken),
      isAdmin: isAdminRole(authState.user?.role),
      login,
      logout,
    }),
    [authState.accessToken, authState.user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

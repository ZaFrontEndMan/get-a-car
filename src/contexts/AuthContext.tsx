import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  startTransition,
} from "react";
import Cookies from "js-cookie";

interface JWTUser {
  id: string;
  roles: string; // API sends e.g., "Vendor" | "Client" | "Admin"
  userName: string;
  token: string;
  isConfirmed: boolean;
  permissions?: string[];
  userType?: string; // e.g., "Vendor"
}

// Accept token with optional explicit fields; token is the source of truth
type SetAuthDataInput = Partial<Omit<JWTUser, "token">> & { token: string };

interface AuthContextType {
  user: JWTUser | null;
  token: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  setAuthData: (userData: SetAuthDataInput) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Safely decode a JWT payload without verification
const decodeJwt = (token: string): any | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
};

const normalizeUserFromToken = (
  token: string,
  override?: Partial<JWTUser>
): JWTUser | null => {
  const payload = decodeJwt(token);
  if (!payload) return null;
  // Backend sample fields: nameid, unique_name, role, UserType, Permission[]
  const normalized: JWTUser = {
    id: override?.id || payload.nameid || payload.sub || "",
    roles: (override?.roles || payload.role || "").toString(),
    userName: override?.userName || payload.unique_name || payload.email || "",
    token,
    isConfirmed: override?.isConfirmed ?? true,
    permissions:
      override?.permissions || payload.Permission || payload.permissions || [],
    userType: override?.userType || payload.UserType || payload.userType,
  };
  return normalized;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<JWTUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const checkExistingAuth = async () => {
      try {
        setIsLoading(true);
        const authToken = Cookies.get("auth_token");
        if (authToken) {
          const normalized = normalizeUserFromToken(authToken);
          if (normalized) {
            startTransition(() => {
              setToken(authToken);
              setUser(normalized);
            });
            console.log("Restored auth from token:", normalized.userName);
          } else {
            // Token is invalid, remove it
            Cookies.remove("auth_token");
            console.warn("Invalid token found, removing from cookies");
          }
        }
      } catch (error) {
        console.error("Error checking existing auth:", error);
        // Clear potentially corrupted auth data
        Cookies.remove("auth_token");
      } finally {
        // Add a small delay to prevent flash of loading state
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    checkExistingAuth();
  }, []);

  const setAuthData = useCallback((input: SetAuthDataInput) => {
    const normalized = normalizeUserFromToken(
      input.token,
      input as Partial<JWTUser>
    );
    if (!normalized) {
      console.error("Invalid token provided to setAuthData");
      return;
    }
    // Batch state updates to prevent multiple re-renders
    startTransition(() => {
      setUser(normalized);
      setToken(normalized.token);
    });
    Cookies.set("auth_token", normalized.token, { expires: 7 });
    console.log(
      "Auth data set:",
      normalized.userName,
      "role:",
      normalized.roles
    );
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log("Starting logout process...");
      setIsLoading(true); // Show loading during logout
      
      Cookies.remove("auth_token");
      
      // Batch state updates to prevent multiple re-renders
      startTransition(() => {
        setUser(null);
        setToken(null);
        setIsLoading(false); // Ensure loading is false after logout
      });
      
      console.log("Sign out successful");
    } catch (error) {
      console.error("Sign out error:", error);
      // Force clear state even if signOut fails
      startTransition(() => {
        setUser(null);
        setToken(null);
        setIsLoading(false); // Ensure loading is false after logout
      });
      throw error;
    }
  }, []);

  const value = {
    user,
    token,
    isLoading,
    signOut,
    setAuthData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>; // تم تغيير العودة لتكون boolean
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------
// HELPER: Safely get from localStorage
// ---------------------------------------------
const safeLocalStorageGet = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

// ---------------------------------------------
// HELPER: Safely set to localStorage
// ---------------------------------------------
const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Error setting localStorage:", error);
    return false;
  }
};

// ---------------------------------------------
// HELPER: Safely remove from localStorage
// ---------------------------------------------
const safeLocalStorageRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load session from localStorage
  useEffect(() => {
    try {
      const savedUser = safeLocalStorageGet("auth_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setProfile(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      safeLocalStorageRemove("auth_user"); // Remove corrupted data
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  }, []);

  // ---------------------------------------------
  // LOGIN
  // ---------------------------------------------
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      const savedUsersStr = safeLocalStorageGet("all_users");
      const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];

      if (!Array.isArray(savedUsers)) {
        console.error("Corrupted 'all_users' data in localStorage");
        toast.error("An internal error occurred. Please try again.");
        setLoading(false);
        return;
      }

      const found = savedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!found) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      if (safeLocalStorageSet("auth_user", JSON.stringify(found))) {
        setUser(found);
        setProfile(found);
        toast.success("Logged in successfully!");
      } else {
        toast.error("Login successful, but failed to save session.");
      }
    } catch (error) {
      console.error("Login process error:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // SIGN UP
  // ---------------------------------------------
  const signUp = async ({ email, password, firstName, lastName }: any) => {
    setLoading(true);

    try {
      const usersStr = safeLocalStorageGet("all_users");
      const users = usersStr ? JSON.parse(usersStr) : [];

      if (!Array.isArray(users)) {
        console.error("Corrupted 'all_users' data in localStorage");
        toast.error("An internal error occurred. Please try again.");
        setLoading(false);
        return false;
      }

      // prevent duplicate accounts
      if (users.find((u: any) => u.email === email)) {
        toast.error("Email already exists");
        setLoading(false);
        return false;
      }

      const newUser = { email, password, firstName, lastName };
      users.push(newUser);

      if (!safeLocalStorageSet("all_users", JSON.stringify(users))) {
        toast.error("Failed to save user data.");
        setLoading(false);
        return false;
      }

      // auto-login after signup
      if (safeLocalStorageSet("auth_user", JSON.stringify(newUser))) {
        setUser(newUser);
        setProfile(newUser);
        toast.success("Account created successfully!");
        setLoading(false);
        return true;
      } else {
        toast.error("Account created, but failed to log in automatically.");
        setLoading(false);
        return true; // Account created successfully
      }
    } catch (error) {
      console.error("Sign Up process error:", error);
      toast.error("An unexpected error occurred during sign up.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------
  const logout = () => {
    safeLocalStorageRemove("auth_user");
    setUser(null);
    setProfile(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        profile,
        login,
        signUp,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
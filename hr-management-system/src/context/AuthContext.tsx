import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
    role: string | null;
    login: (role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // ✅ LAZY INITIAL STATE: Reads localStorage BEFORE the first render.
    // This prevents the app from seeing 'null' on refresh.
    const [role, setRole] = useState<string | null>(() => {
        try {
            const storedRole = localStorage.getItem("role");
            return storedRole ? storedRole.toLowerCase() : null;
        } catch {
            return null;
        }
    });

    const login = (newRole: string) => {
        const formattedRole = newRole.toLowerCase();
        localStorage.setItem("role", formattedRole);
        setRole(formattedRole);
    };

    const logout = () => {
        localStorage.removeItem("role");
        setRole(null);
        // Optional: call your backend logout API to clear the HttpOnly cookie
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
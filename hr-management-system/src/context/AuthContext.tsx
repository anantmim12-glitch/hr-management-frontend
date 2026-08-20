import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
    role: string | null;
    login: ({ role, email }: { role: string, email: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // ✅ LAZY INITIAL STATE: Reads localStorage BEFORE the first render.
    const [role, setRole] = useState<string | null>(() => {
        try {
            const userDetails = localStorage.getItem("userDetails");
            return userDetails ? JSON.parse(userDetails).role : null;
        } catch {
            return null;
        }
    });

    const login = ({ role: newRole, email }: { role: string, email: string }) => {
        const formattedRole = newRole.toLowerCase();
        localStorage.setItem("userDetails", JSON.stringify({ role: formattedRole, email }));
        setRole(formattedRole);
    };

    const logout = () => {
        localStorage.removeItem("userDetails");
        localStorage.removeItem("currentUser");
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
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Users, Building2, LogOut, ShieldCheck, CalendarCheck, LayoutDashboard } from "lucide-react";
import { useLogout } from "../../hooks/useApi";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { role, logout } = useAuth();
    const navigate = useNavigate();
    const mutation = useLogout();

    const handleLogout = () => {
        mutation.mutate(undefined, {
            onSuccess: () => {
                logout();
                navigate("/login");
            },
            onError: (error) => {
                console.log(error);
            }
        });
    };

    // Update the navItems array inside DashboardLayout.tsx
    const navItems = [
        { to: "/employees", label: "Employees", icon: Users },
        { to: "/departments", label: "Departments", icon: Building2 },
        { to: "/attendance", label: "Attendance", icon: CalendarCheck }, // Add this line
        { to: "/create-login", label: "Create Login", icon: ShieldCheck },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">HR System</h1>
                        <p className="text-xs text-slate-500 capitalize">{role} Portal</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                    : "hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-red-500/10 transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
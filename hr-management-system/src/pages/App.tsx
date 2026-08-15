import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../context/AuthContext";
import Login from "./Login";
import Employees from "./Employees";
import Departments from "./Departments";
import CreateLogin from "./CreateLogin";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        {/* All pages inside here require the user to be logged in */}
                        <Route element={<ProtectedRoute><DashboardLayout><Outlet /></DashboardLayout></ProtectedRoute>}>
                            <Route path="/employees" element={<Employees />} />
                            <Route path="/departments" element={<Departments />} />

                            {/* Only Admin/HR can see the CreateLogin route */}
                            <Route path="/create-login" element={
                                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                                    <CreateLogin />
                                </ProtectedRoute>
                            } />
                        </Route>

                        <Route path="*" element={<Navigate to="/employees" replace />} />
                    </Routes>
                </BrowserRouter>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
            </AuthProvider>
        </QueryClientProvider>
    );
}
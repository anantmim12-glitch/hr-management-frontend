import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "react-toastify";
import { LogIn, ShieldCheck } from "lucide-react";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    const mutation = useLogin();

    const onSubmit = (data: any) => {
        mutation.mutate(data, {
            onSuccess: (res) => {
                login({ role: res.role, email: data.Email });
                navigate("/employees");
            },
            onError: () => toast.error("Login failed. Check credentials."),
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-lg mb-2">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">HR Platform</h1>
                    <p className="text-sm text-slate-300">Sign in to manage your workforce</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="Email" className="text-slate-200">Email Address</Label>
                        <Input
                            id="Email"
                            type="email"
                            {...register("Email")}
                            required
                            defaultValue="anant@myinboxmedia.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="Password" className="text-slate-200">Password</Label>
                        <Input
                            id="Password"
                            type="password"
                            {...register("Password")}
                            required
                            defaultValue="iamanant01"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                        disabled={mutation.isPending}
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        {mutation.isPending ? "Authenticating..." : "Secure Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
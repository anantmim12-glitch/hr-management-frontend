import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateLogin, useGetEmployees } from "../hooks/useApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { UserPlus, KeyRound, ShieldCheck, Users } from "lucide-react";

export default function CreateLogin() {
    const { register, handleSubmit, setValue, watch } = useForm<{ Id: number; Password: string; Role: string }>();
    const mutation = useCreateLogin();

    // Fetch employees to populate the dropdown
    const { data: employees, isLoading: empLoading } = useGetEmployees();

    const onSubmit = (data: any) => {
        mutation.mutate({ ...data, Id: Number(data.Id) }, {
            onSuccess: () => toast.success("Login created successfully"),
            onError: () => toast.error("Failed to create login"),
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Access Management</h1>
                <p className="text-slate-500 mt-1">Create secure login credentials for your team members.</p>
            </div>

            {/* Main Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-slate-800">Generate New Credentials</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Assign roles and set secure passwords.</p>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Employee Select Dropdown */}
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" /> Select Employee
                            </Label>
                            <Select onValueChange={(val: string) => setValue("Id", Number(val))}>
                                <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white h-12 transition-colors">
                                    <SelectValue placeholder={empLoading ? "Loading employees..." : "Choose an employee by name"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {employees?.map((emp: any) => (
                                        <SelectItem key={emp.Id} value={String(emp.Id)}>
                                            {emp.FirstName} {emp.LastName} <span className="text-slate-400 ml-2">({emp.Email})</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!watch("Id") && <p className="text-xs text-amber-600 mt-1">Please select an employee to continue.</p>}
                        </div>

                        {/* Grid for Password and Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-2">
                                    <KeyRound className="h-4 w-4 text-slate-400" /> Temporary Password
                                </Label>
                                <Input
                                    type="password"
                                    {...register("Password")}
                                    required
                                    placeholder="••••••••"
                                    className="bg-slate-50 border-slate-200 focus:bg-white h-12 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-slate-400" /> Access Role
                                </Label>
                                <Select onValueChange={(val: string) => setValue("Role", val as "Admin" | "HR" | "Employee")}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white h-12 transition-colors">
                                        <SelectValue placeholder="Assign a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                                        <SelectItem value="HR">HR (Management Access)</SelectItem>
                                        <SelectItem value="Employee">Employee (Standard Access)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all px-8 py-3"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Creating Account..." : "Generate Login"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
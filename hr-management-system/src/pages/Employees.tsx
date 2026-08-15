import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useGetEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useGetDepartments } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Pencil, Trash2, Plus, Mail, Phone, Search, Building2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Employees() {
    const { data, isLoading } = useGetEmployees();
    const { data: departments, isLoading: deptLoading } = useGetDepartments();

    // ✅ Get current user role
    const { role } = useAuth();
    const canModify = role === "admin" || role === "hr";

    const createMut = useCreateEmployee();
    const updateMut = useUpdateEmployee();
    const deleteMut = useDeleteEmployee();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { register, handleSubmit, reset, control } = useForm<any>();

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((emp: any) => {
            const fullName = `${emp.FirstName} ${emp.LastName}`.toLowerCase();
            const email = emp.Email.toLowerCase();
            const search = searchTerm.toLowerCase();
            return fullName.includes(search) || email.includes(search);
        });
    }, [data, searchTerm]);

    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0];
    };

    const handleOpen = (emp: any | null) => {
        if (emp) {
            const formattedEmp = {
                ...emp,
                HireDate: formatDateForInput(emp.HireDate)
            };
            setEditing(formattedEmp);
            reset(formattedEmp);
        } else {
            setEditing(null);
            reset({});
        }
        setOpen(true);
    };

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            DepartmentId: Number(data.DepartmentId),
            Salary: Number(data.Salary)
        };

        if (editing && editing.Id) {
            updateMut.mutate({ id: editing.Id, data: payload }, {
                onSuccess: () => { toast.success("Employee Updated"); setOpen(false); }
            });
        } else {
            createMut.mutate(payload, {
                onSuccess: () => { toast.success("Employee Created"); setOpen(false); }
            });
        }
    };

    const handleDelete = (id: number) => {
        deleteMut.mutate(id, { onSuccess: () => toast.success("Employee Deleted") });
    };

    const getInitials = (first: string, last: string) => `${first[0] || ''}${last[0] || ''}`.toUpperCase();

    const getDeptName = (deptId: number) => {
        const dept = departments?.find((d: any) => d.Id === deptId);
        return dept ? dept.DepartmentName : "N/A";
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Members</h1>
                    <p className="text-slate-500 mt-1">Manage your employees, their roles, and details.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search employees..."
                            className="pl-9 w-64 bg-white border-slate-200 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* ✅ Only show Add button if user can modify */}
                    {canModify && (
                        <Button
                            onClick={() => handleOpen(null)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Employee
                        </Button>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                            <TableHead className="w-[300px] font-semibold text-slate-600">Employee</TableHead>
                            <TableHead className="font-semibold text-slate-600">Contact</TableHead>
                            <TableHead className="font-semibold text-slate-600">Department</TableHead>
                            {canModify ? (<TableHead className="font-semibold text-slate-600">Salary</TableHead>) : ""}
                            <TableHead className="font-semibold text-slate-600">Hire Date</TableHead>
                            {/* ✅ Only show Actions header if user can modify */}
                            <TableHead className="text-right font-semibold text-slate-600">
                                {canModify ? "Actions" : ""}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-400">Loading employees...</TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                                    {searchTerm ? "No employees match your search." : "No employees found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((emp: any) => (
                                <TableRow key={emp.Id} className="border-b border-slate-100 transition-colors hover:bg-blue-50/40">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm shadow-sm">
                                                {getInitials(emp.FirstName, emp.LastName)}
                                            </div>
                                            <div>
                                                <div className="text-slate-900">{emp.FirstName} {emp.LastName}</div>
                                                <div className="text-xs text-slate-500">ID: {emp.Id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs text-slate-600">
                                            <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {emp.Email}</div>
                                            <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {canModify ? emp.Phone : "******"}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                                            <Building2 className="h-3 w-3" />
                                            {getDeptName(emp.DepartmentId)}
                                        </span>
                                    </TableCell>
                                    {canModify ? (<TableCell className="font-semibold text-slate-700">${emp.Salary.toLocaleString()}</TableCell>) : ""}
                                    <TableCell className="text-slate-600">{new Date(emp.HireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                                    <TableCell className="text-right">
                                        {/* ✅ Only render Edit/Delete buttons if user can modify */}
                                        {canModify ? (
                                            <div className="flex gap-2 justify-end">
                                                <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors" onClick={() => handleOpen(emp)}>
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-colors" onClick={() => handleDelete(emp.Id!)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">View Only</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog Form */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-xl">
                    <DialogHeader className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <DialogTitle className="text-xl text-slate-800">{editing ? "Edit Employee Details" : "Onboard New Employee"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        {/* ... form inputs remain exactly the same ... */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700">First Name</Label>
                                <Input {...register("FirstName")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Last Name</Label>
                                <Input {...register("LastName")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700">Email Address</Label>
                            <Input type="email" {...register("Email")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700">Phone Number</Label>
                            <Input {...register("Phone")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Department</Label>
                            <Controller
                                control={control}
                                name="DepartmentId"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? String(field.value) : ""}
                                    >
                                        <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                                            <SelectValue placeholder={deptLoading ? "Loading..." : "Select a department"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-slate-900 border-slate-200">
                                            {departments?.map((dept: any) => (
                                                <SelectItem key={dept.Id} value={String(dept.Id)}>
                                                    {dept.DepartmentName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Salary ($)</Label>
                                <Input type="number" {...register("Salary")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Hire Date</Label>
                                <Input type="date" {...register("HireDate")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" disabled={createMut.isPending || updateMut.isPending}>
                                {editing ? "Save Changes" : "Add Employee"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
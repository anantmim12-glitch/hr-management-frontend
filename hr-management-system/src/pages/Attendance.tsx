import { useState, useMemo } from "react";
import { useGetAttendance, useMarkAttendance, useGetEmployees } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle, Fingerprint, Filter } from "lucide-react";
import { toast } from "react-toastify";

export default function Attendance() {
    const { role } = useAuth();
    const canModify = role === "admin" || role === "hr";

    // Filter states
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [fromDate, setFromDate] = useState(firstDayOfMonth);
    const [toDate, setToDate] = useState(today);
    const [employeeId, setEmployeeId] = useState<string>("");

    // Fetch Data
    const { data: employees } = useGetEmployees();
    const { data: attendanceRecords, isLoading } = useGetAttendance({
        fromDate,
        toDate,
        employeeId: employeeId ? Number(employeeId) : undefined,
    });

    const markMut = useMarkAttendance();

    // Calculate Summary Stats
    const summary = useMemo(() => {
        if (!attendanceRecords) return { present: 0, absent: 0, halfDays: 0, total: 0 };

        return attendanceRecords.reduce((acc: any, record: any) => {
            acc.total += 1;
            const status = record.Status?.toLowerCase() || "";
            if (status.includes("present")) acc.present += 1;
            else if (status.includes("absent")) acc.absent += 1;
            else if (status.includes("half")) acc.halfDays += 1;
            return acc;
        }, { present: 0, absent: 0, halfDays: 0, total: 0 });
    }, [attendanceRecords]);

    const handleMarkAttendance = () => {
        markMut.mutate(undefined, {
            onSuccess: () => toast.success("Attendance marked successfully for all employees!"),
            onError: () => toast.error("Failed to mark attendance."),
        });
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Good morning! <span className="text-blue-600">Anant</span> 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Here is your attendance overview for today.</p>
                </div>
                {canModify && (
                    <Button
                        onClick={handleMarkAttendance}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                        disabled={markMut.isPending}
                    >
                        <Fingerprint className="mr-2 h-4 w-4" />
                        {markMut.isPending ? "Marking..." : "Mark All Attendance"}
                    </Button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Present Days</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{summary.present}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Absent Days</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{summary.absent}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Half Days</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{summary.halfDays}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Records</CardTitle>
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Card */}
            <Card className="shadow-sm border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-slate-500" />
                    <h3 className="text-lg font-semibold text-slate-800">Filter Attendance History</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-700">From Date</Label>
                        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-700">To Date</Label>
                        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-slate-50 border-slate-200" />
                    </div>

                    {canModify ? (
                        <div className="space-y-2">
                            <Label className="text-slate-700">Employee</Label>
                            <Select value={employeeId} onValueChange={setEmployeeId}>
                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="All Employees" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-slate-900 border-slate-200">
                                    {employees?.map((emp: any) => (
                                        <SelectItem key={emp.Id} value={String(emp.Id)}>
                                            {emp.FirstName} {emp.LastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2 hidden md:block">
                            <Label className="text-slate-700">Employee</Label>
                            <Input value="My Attendance" disabled className="bg-slate-100 border-slate-200 text-slate-500" />
                        </div>
                    )}
                </div>
            </Card>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Attendance History</h3>
                    <p className="text-sm text-slate-500">Showing records from {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}</p>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                            <TableHead className="font-semibold text-slate-600">Date</TableHead>
                            <TableHead className="font-semibold text-slate-600">Check In</TableHead>
                            <TableHead className="font-semibold text-slate-600">Check Out</TableHead>
                            <TableHead className="font-semibold text-slate-600">Work Hours</TableHead>
                            <TableHead className="font-semibold text-slate-600">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-400">Loading attendance...</TableCell>
                            </TableRow>
                        ) : attendanceRecords?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-400">No attendance records found for this filter.</TableCell>
                            </TableRow>
                        ) : (
                            attendanceRecords?.map((record: any, index: number) => (
                                <TableRow key={index} className="border-b border-slate-100 transition-colors hover:bg-blue-50/40">
                                    <TableCell className="font-medium text-slate-800">
                                        {new Date(record.Date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-slate-600 flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-emerald-500" /> {record.CheckIn || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-600 flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-red-500" /> {record.CheckOut || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-700 font-medium">{record.WorkHours || "0h 0m"}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${record.Status?.toLowerCase().includes('present') ? 'bg-emerald-50 text-emerald-700' :
                                                record.Status?.toLowerCase().includes('absent') ? 'bg-red-50 text-red-700' :
                                                    record.Status?.toLowerCase().includes('half') ? 'bg-amber-50 text-amber-700' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {record.Status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
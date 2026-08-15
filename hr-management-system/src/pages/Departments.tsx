import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "../hooks/useApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";


export default function Departments() {
    const { data, isLoading } = useGetDepartments();
    const createMut = useCreateDepartment();
    const updateMut = useUpdateDepartment();
    const deleteMut = useDeleteDepartment();

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const { register, handleSubmit, reset } = useForm<any>();

    const handleOpen = (dept: any | null) => {
        setEditing(dept);
        reset(dept || {});
        setOpen(true);
    };

    const onSubmit = (data: any) => {
        if (editing && editing.Id) {
            updateMut.mutate({ id: editing.Id, data }, { onSuccess: () => { toast.success("Updated"); setOpen(false); } });
        } else {
            createMut.mutate(data, { onSuccess: () => { toast.success("Created"); setOpen(false); } });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Departments</h1>
                <Button onClick={() => handleOpen(null)}><Plus className="mr-2 h-4 w-4" /> Add Department</Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? <TableRow><TableCell>Loading...</TableCell></TableRow> :
                            data?.map((dept: any) => (
                                <TableRow key={dept.Id}>
                                    <TableCell className="font-medium">{dept.DepartmentName}</TableCell>
                                    <TableCell>{dept.Description}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleOpen(dept)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => deleteMut.mutate(dept.Id!)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-xl">
                    <DialogHeader className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <DialogTitle className="text-xl text-slate-800">{editing ? "Edit Department" : "Add Department"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-slate-700">Department Name</Label>
                            <Input {...register("DepartmentName")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700">Description</Label>
                            <Input {...register("Description")} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                disabled={createMut.isPending || updateMut.isPending}
                            >
                                {editing ? "Save Changes" : "Add Department"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
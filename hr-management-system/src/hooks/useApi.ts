import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Employees
export const useGetEmployees = () => useQuery({ queryKey: ["employees"], queryFn: async () => (await api.get(`${baseURL}/api/employees/`)).data });
export const useCreateEmployee = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data) => (await api.post(`${baseURL}/api/employees/create`, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    });
};
export const useUpdateEmployee = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => (await api.put(`${baseURL}/api/employees/update/${id}`, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    });
};
export const useDeleteEmployee = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => (await api.delete(`${baseURL}/api/employees/delete/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    });
};

// Departments
export const useGetDepartments = () => useQuery({ queryKey: ["departments"], queryFn: async () => (await api.get(`${baseURL}/api/departments/`)).data });
export const useCreateDepartment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data) => (await api.post(`${baseURL}/api/departments/create`, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
    });
};
export const useUpdateDepartment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => (await api.put(`${baseURL}/api/departments/update/${id}`, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
    });
};
export const useDeleteDepartment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => (await api.delete(`${baseURL}/api/departments/delete/${id}`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
    });
};

// Auth
export const useLogin = () => useMutation({
    mutationFn: async (data) => (await api.post(`${baseURL}/api/auth/login`, data)).data,
});

export const useCreateLogin = () => useMutation({
    mutationFn: async (data) => (await api.post(`${baseURL}/api/user/createLogin`, data)).data,
});

// Attendance
export const useMarkAttendance = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => (await api.post("/api/attendance/markAttendance", {})).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["attendance"] });
            // Also invalidate employees if the mark attendance endpoint modifies employee data
            qc.invalidateQueries({ queryKey: ["employees"] });
        },
    });
};

export const useGetAttendance = (params: { fromDate?: string; toDate?: string; employeeId?: number }) => {
    return useQuery({
        queryKey: ["attendance", params],
        queryFn: async () => {
            const res = await api.get("/api/attendance/getAttendance", { params });
            return res.data;
        },
    });
};
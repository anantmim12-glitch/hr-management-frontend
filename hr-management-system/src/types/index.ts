export interface Employee {
    Id?: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    Salary: number;
    HireDate: string;
}

export interface Department {
    Id?: number;
    DepartmentName: string;
    Description: string;
}

export interface UserAuth {
    Email: string;
    Password: string;
}

export interface AuthResponse {
    message: string;
    role: "Admin" | "HR" | "Employee";
}

export interface CreateLoginPayload {
    Id: number;
    Password: string;
    Role: "Admin" | "HR" | "Employee";
}
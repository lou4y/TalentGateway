export interface User {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    createddate?: number;
    token?: string;
    email: string;
    role: string[];
}

export interface Kuser {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    createdDate: number;
    isEmailVerified: boolean;
  }

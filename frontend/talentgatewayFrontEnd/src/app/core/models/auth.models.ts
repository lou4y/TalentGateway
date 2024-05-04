export interface User {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    email: string;
    role: string[];
}

export interface Kuser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    isEmailVerified: boolean;
  }

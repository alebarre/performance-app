export interface User {
    substring(arg0: number): any;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    title: string;
    bio: string;
    imageUrl: string;
    enabled: boolean;
    notLocked: boolean;
    usingMfa: boolean;
    createdAt: Date;
    roleName: string;
    permissions: string;
}

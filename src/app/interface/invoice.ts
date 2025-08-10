export interface Invoice {
    id: number;
    invoice: string;
    services: string;
    status: string;
    total: number;
    createdAt?: Date;
    }
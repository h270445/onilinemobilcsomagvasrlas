export interface Plan {
    id?: string;
    name: string;
    description: string;
    price: number;
    dataAllowance: number;
    duration: string;
    isActive: boolean;
  }
import { Timestamp } from '@angular/fire/firestore';

export interface Subscription {
  id?: string; // Optional, if you use idField: 'id'
  planId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'active' | 'cancelled' | 'expired' | 'trialing'; // Example statuses
  dataCap: number;
}
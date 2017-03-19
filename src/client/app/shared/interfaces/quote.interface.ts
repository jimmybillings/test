import { Project } from './cart.interface';

export interface Quote {
  createdUserId?: number;
  ownerUserId: number;
  userId: number;
  projects?: Project[];
  total: number;
  itemCount?: number;
  quoteStatus: 'ACTIVE' | 'PENDING' | 'ORDERED' | 'EXPIRED';
}

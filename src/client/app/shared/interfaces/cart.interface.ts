export interface Cart {
  userId: number;
  projects?: Project[];
  total: number;
}

export interface Project {
  id: string;
  name: string;
  subtotal: number;
}


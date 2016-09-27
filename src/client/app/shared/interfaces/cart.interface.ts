export interface Cart {
  userId: number;
  projects?: Project[];
  total: number;
}

export interface Project {
  name: string;
}


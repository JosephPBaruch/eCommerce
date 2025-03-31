export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  created_at: string;
  updated_at: string;
  user: string | null;
}

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

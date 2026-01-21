export interface User {
  id: number;
  username: string;
  avatar_url: string;
  country_code: string;
  role?: 'user' | 'admin'; 
}
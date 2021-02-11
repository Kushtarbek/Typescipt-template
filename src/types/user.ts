export interface User {
  id: string;
  avatar: string;
  email: string;
  name: string;
  seller: string;
  [key: string]: any;
  capabilities: string[];
}

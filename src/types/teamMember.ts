export interface TeamMember {
  uid: string;
  address1?: string;
  address2?: string;
  avatar?: string;
  email: string;
  isVerified?: boolean;
  name: string;
  capabilities: string[];
}

export interface TeamMemberLog {
  id: string;
  createdAt: number;
  description: string;
  ip: string;
  method: string;
  route: string;
  status: number;
}

export interface TeamMemberEmail {
  id: string;
  description: string;
  createdAt: number;
}

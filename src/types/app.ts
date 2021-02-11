export type NotificationType = 'invite' | 'message' | 'payout';

export interface Notification {
  id: string;
  value: number;
  type: NotificationType;
  message: string;
}

export interface Statistics {
  payout: number;
  projects: number;
  visitors: number;
  watching: number;
}

export interface AppActivity {
  id: string;
  createdAt: number;
  description: string;
  subject: string;
  type: string;
}

export interface AppAuthor {
  id: string;
  avatar: string;
  name: string;
}

export interface AppFile {
  id: string;
  mimeType: string;
  name: string;
  size: number;
  url: string;
}

export interface AppUser {
  id: string;
  avatar: string;
  bio: string;
  name: string;
}

export interface AppReview {
  id: string;
  author: {
    avatar: string;
    name: string;
  };
  comment: string;
  createdAt: number;
  value: number;
}

export interface App {
  id: string;
  activities?: AppActivity[];
  author: AppAuthor;
  fee: number;
  caption: string;
  currency: string;
  description?: string;
  files?: AppFile[];
  image?: string;
  isActive?: boolean;
  tags?: string[]; //
  title: string;
  type: 'App' | 'Extension';
  updatedAt: number;
}

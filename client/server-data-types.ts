export interface ServerDataPage {
  id: number;
  uuid: string;
  title: string;
  ast: string;
  userId: number;
  updatedAt: string;
  createdAt: string;
}
export interface ServerDataMeta {
  id: number;
  description: string;
  keywords: string;
  author: string;
  theme: string;
  ogTitle: string;
  ogType: string;
  ogImage: string;
  ogUrl: string;
  ogDescription: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  pageId: number;
  updatedAt: Date;
  deletedAt: Date;
  createdAt: Date;
}
export interface ServerDataUser {
  id: number;
  uuid: string;
  username: string;
  avatarUrl: string;
  email: string;
  googleId: string;
  updatedAt: Date;
  createdAt: Date;
}
export interface Response<T> {
  code: number;
  message: string;
  data: T;
}
//
// user
//
export interface UserType {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  googleId: number;
  updatedAt: string;
  createdAt: string;
}
//
// page
//
export interface PageType {
  id: number;
  uuid: string;
  title: string;
  ast: string;
  userId: number;
  updatedAt: string;
  createdAt: string;
}
export interface PostPageRequestBody {
  uuid: string;
  title: string;
  ast: string;
}
export interface PostPageResponseBody extends PostPageRequestBody {
  id: number;
  userId: number;
  updatedAt: string;
  createdAt: string;
}
export interface PutPageRequestBody {
  id: number;
  title: string;
  ast: string;
}
export interface DeletePageRequestBody {
  id: number;
}
//
// upload
//
export enum PostUploadRequestQueryTypeEnum {
  IMAGE = "IMAGE",
}
export interface PostUploadRequestQuery {
  [key: string]: any;
  type: PostUploadRequestQueryTypeEnum;
}
//
// public
//
export interface UserWithPagesType extends UserType {
  pages: PageType[];
}
export type GetPublicRenderDatasResponseBody = UserWithPagesType[];
export interface GetPublicPageRequestQuery {
  id: PageType['id'];
}
export type GetPublicPageReponseBody = PageType;
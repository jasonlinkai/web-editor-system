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
  uuid: string;
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
  meta: {
    id?: number;
    description?: string;
    keywords?: string;
    author?: string;
    theme?: string;
    ogTitle?: string;
    ogType?: string;
    ogImage?: string;
    ogUrl?: string;
    ogDescription?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonical?: string;

    updatedAt?: Date;
    deletedAt?: Date;
    createdAt?: Date;
  };
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
  userUuid: string;
  pageUuid: string;
}
export type GetPublicPageReponseBody = PageType;

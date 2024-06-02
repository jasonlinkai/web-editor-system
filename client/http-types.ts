import {
  ServerDataMeta,
  ServerDataPage,
  ServerDataUser,
} from "./server-data-types";

// common
export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

//
// page
//
export interface GetPublicPageRequestQuery {
  userUuid: ServerDataUser["uuid"];
  pageUuid: ServerDataPage["uuid"];
}

export interface GetPublicPageReponseBody extends ServerDataPage {
  meta: ServerDataMeta;
  user: ServerDataUser;
}

export interface PostPageRequestBody {
  uuid: ServerDataPage["uuid"];
  title: ServerDataPage["title"];
  ast: ServerDataPage["ast"];
}

export interface PostPageResponseBody extends ServerDataPage {}

export interface PutPageRequestBody {
  id: ServerDataPage["id"];
  title: ServerDataPage["title"];
  ast: ServerDataPage["ast"];
  meta: ServerDataMeta;
}

export interface DeletePageRequestBody {
  id: ServerDataPage["id"];
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
export interface GetPublicRenderDatasResponseBody extends ServerDataUser {
  page: (ServerDataPage & { meta: ServerDataMeta })[];
}

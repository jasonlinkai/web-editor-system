//
// page
//
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
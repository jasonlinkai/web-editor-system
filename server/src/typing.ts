import { Request } from "express";
import { User } from "./database/models";
import fileUpload from "express-fileupload";

//
// common
//
export type RequestWithAuth<T extends Request = Request> = T & {
  auth?: {
    user: User;
  };
};

//
// page
//
export interface PostPageBody {
  uuid: string;
  title: string;
  ast: string;
}
export interface PutPageBody {
  id: number;
  title: string;
  ast: string;
}
export interface DeletePageBody {
  id: number;
}

//
// upload
//
export enum UploadPostQueryTypeEnum {
  IMAGE = "IMAGE",
}
export interface UploadPostQuery {
  [key: string]: any;
  type: UploadPostQueryTypeEnum;
}
export interface UploadPostBody {
  files?: {
    file: fileUpload.UploadedFile;
  };
}

import { Request } from "express";
import { User } from "./database/models";

//
// common
//
export type RequestWithAuth<T extends Request = Request> = T & {
  auth?: {
    user: User;
  };
};
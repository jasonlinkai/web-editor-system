import { SNAPSHOT_KEYS } from "./mobx/MobxStateTreeProvider";
import { RootStoreSnapshotOutType } from "./mobx/RootStore";

const api = "http://localhost:3001";
const cdnUrl = "http://localhost:3001/public/uploads";

export const getApiUrlByPath = (path: string) => {
  return `${api}/${path}`;
};

export const getStaticUrlByFilename = (filename: string) => {
  return `${cdnUrl}/${filename}`;
};

interface Response<T> {
  code: number;
  message: string;
  data: T;
}

const getToken = (): string => {
  try {
    const rootStoreSnapshotJSON = localStorage.getItem(
      SNAPSHOT_KEYS.ROOT_STORE
    );
    if (rootStoreSnapshotJSON) {
      const rootStoreSnapshot: RootStoreSnapshotOutType = JSON.parse(
        rootStoreSnapshotJSON
      );
      return `Bearer ${rootStoreSnapshot.token}`;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
};

export type PostUploadImageResponse = string;
export const httpPostUploadImage = async (formData: FormData) => {
  try {
    const response = await fetch(getApiUrlByPath("upload-image"), {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
      body: formData,
    });
    const data = await response.json();
    return data as Response<PostUploadImageResponse>;
  } catch (e) {
    console.error("Error httpPostUploadImage:", e);
    throw e;
  }
};

export type GetUploadedImagesResponse = string[];
export const httpGetUploadedImages = async () => {
  try {
    const response = await fetch(getApiUrlByPath("uploaded-images"), {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    });
    const data = await response.json();
    return data as Response<GetUploadedImagesResponse>;
  } catch (e) {
    console.error("Error httpGetUploadedImages:", e);
    throw e;
  }
};

export type PostUploadPageResponse = boolean;
export const httpPostUploadPage = async (json: string) => {
  try {
    const response = await fetch(getApiUrlByPath("publish"), {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: json,
    });
    const data = await response.json();
    return data as Response<PostUploadPageResponse>;
  } catch (e) {
    console.error("Error httpPostUploadPage:", e);
    throw e;
  }
};

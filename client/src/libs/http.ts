import { SNAPSHOT_KEYS } from "./mobx/MobxStateTreeProvider";
import { RootStoreSnapshotOutType } from "./mobx/RootStore";
console.log("process.env", process.env);
const apiUrl = process.env.REACT_APP_API_URL;
const cdnUrl = process.env.REACT_APP_CDN_URL;

export const getApiUrlByPath = (path: string) => {
  return `${apiUrl}/${path}`;
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

export type GetTestServerResponse = { url: string }[];
export const httpGetTestServer = async () => {
  try {
    const response = await fetch(getApiUrlByPath("test-server"), {
      method: "GET",
    });
    const data: Response<GetTestServerResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpGetTestServer:", e);
    throw e;
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
    const data: Response<PostUploadImageResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpPostUploadImage:", e);
    throw e;
  }
};

export type GetUploadedImagesResponse = { url: string }[];
export const httpGetUploadedImages = async () => {
  try {
    const response = await fetch(getApiUrlByPath("uploaded-images"), {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    });
    const data: Response<GetUploadedImagesResponse> = await response.json();
    return data;
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
    const data: Response<PostUploadPageResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpPostUploadPage:", e);
    throw e;
  }
};

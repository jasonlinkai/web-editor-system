import { SnapshotOut } from "mobx-state-tree";
import { SNAPSHOT_KEYS } from "./mobx/MobxStateTreeProvider";
import { RootStoreSnapshotOutType } from "./mobx/RootStore";
import { PageModelType } from "./mobx/PageModel";
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

const request: typeof fetch = async (...args) => {
  const response = await fetch(...args);
  if (response.status >= 400) {
    throw Error(response.statusText);
  }
  return response;
};

export type GetTestServerResponse = { url: string }[];
export const httpGetTestServer = async () => {
  try {
    const response = await request(getApiUrlByPath("test-server"), {
      method: "GET",
    });
    const data: Response<GetTestServerResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpGetTestServer:", e);
    throw e;
  }
};

export type GetPagesServerResponse = SnapshotOut<PageModelType>[];
export const httpGetPages = async () => {
  try {
    const response = await request(getApiUrlByPath("pages"), {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    });
    const data: Response<GetPagesServerResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpGetPages:", e);
    throw e;
  }
};

export type PostPageResponse = boolean;
export const httpPostPage = async (json: string) => {
  try {
    const response = await request(getApiUrlByPath("page"), {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: json,
    });
    console.log("response", response);
    const data: Response<PostPageResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpPostPage:", e);
    throw e;
  }
};

export type PostUploadImageResponse = string;
export const httpPostUploadImage = async (formData: FormData) => {
  try {
    const response = await request(getApiUrlByPath("upload?type=IMAGE"), {
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

export type GetImagesResponse = { url: string }[];
export const httpGetImages = async () => {
  try {
    const response = await request(getApiUrlByPath("images"), {
      method: "GET",
      headers: {
        Authorization: getToken(),
      },
    });
    const data: Response<GetImagesResponse> = await response.json();
    return data;
  } catch (e) {
    console.error("Error httpGetImages:", e);
    throw e;
  }
};

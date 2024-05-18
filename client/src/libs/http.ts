const api = "http://localhost:3001";
// const cdnUrl = "http://localhost:3001/public/uploads";

export const getApiUrlByPath = (path: string) => {
  return `${api}/${path}`;
};

export const getStaticUrlByFilename = (filename: string) => {
  // return `${cdnUrl}/${filename}`;
  return filename;
};

interface Response<T> {
  code: number;
  message: string;
  data: T;
}

export type PostUploadImageResponse = string;
export const httpPostUploadImage = async (formData: FormData) => {
  try {
    const response = await fetch(getApiUrlByPath("upload-s3"), {
      method: "POST",
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
    const response = await fetch(getApiUrlByPath("uploaded-images-s3"), {
      method: "GET",
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
    const response = await fetch(getApiUrlByPath("upload-page-s3"), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
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
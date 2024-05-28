/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_PRIVATE_API_URL: string;
    NEXT_PUBLIC_CDN_URL: string;
  }
}

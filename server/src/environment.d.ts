declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_SECRET_REGION: string;
      GOOGLE_OAUTH2_SECRET: string;
      GOOGLE_OAUTH2_CLIENT_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
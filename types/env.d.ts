declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_SOCKET_URL: string;
      EXPO_PUBLIC_FIREBASE_API_KEY: string;
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
    }
  }
}

export {};
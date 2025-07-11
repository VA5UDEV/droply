"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ImageKitProvider } from "imagekitio-next";
import { createContext, useContext } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// Create a context for ImageKit authentication
export const ImageKitAuthContext = createContext<{
  authenticate: () => Promise<{
    signature: string;
    token: string;
    expire: number;
  }>;
}>({
  authenticate: async () => ({ signature: "", token: "", expire: 0 }),
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

// ImageKit authentication function
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <h1>
      <NextThemesProvider {...themeProps}>
        <ImageKitProvider
          authenticator={authenticator}
          publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        >
          <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>
            {children}
          </ImageKitAuthContext.Provider>
        </ImageKitProvider>
      </NextThemesProvider>
    </h1>
  );
}

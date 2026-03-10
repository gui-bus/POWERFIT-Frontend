import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";

// Tipo do backend para garantir type-safety
export type OurFileRouter = {
  profileImage: {
    input: void;
    output: { url: string };
  };
  workoutImage: {
    input: void;
    output: { url: string };
  };
};

const getUploadThingUrl = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  
  // O backend Gemini confirmou que o prefixo é /api/uploadthing
  // Se a base for http://localhost:8080, o resultado será http://localhost:8080/api/uploadthing
  return `${base}/api/uploadthing`;
};

const url = getUploadThingUrl();

export const UploadButton = generateUploadButton<OurFileRouter>({
  url,
  // @ts-expect-error - requestConfig might not be in the type definition but is accepted at runtime
  requestConfig: {
    credentials: "include",
  },
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url,
  // @ts-expect-error - requestConfig might not be in the type definition but is accepted at runtime
  requestConfig: {
    credentials: "include",
  },
});

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url,
  // @ts-expect-error - requestConfig is necessary for cross-origin credentials
  requestConfig: {
    credentials: "include",
  },
});

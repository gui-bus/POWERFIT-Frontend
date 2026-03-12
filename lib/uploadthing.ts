import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";


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
  


  return `${base}/api/uploadthing`;
};

const url = getUploadThingUrl();

export const UploadButton = generateUploadButton<any>({
  url,
});

export const UploadDropzone = generateUploadDropzone<any>({
  url,
});

export const { useUploadThing, uploadFiles } = generateReactHelpers<any>({
  url,
});

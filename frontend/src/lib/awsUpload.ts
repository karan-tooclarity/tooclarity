import { API_BASE_URL }  from "@/lib/api"

export interface PresignedUrlResponse {
  uploadUrl: string;
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
}

/**
 * Calls your backend API to get a presigned upload URL from AWS S3.
 * @param filename - The name of the file to upload
 * @param filetype - MIME type (e.g. image/png, video/mp4)
 */
export async function getPresignedUrl(filename: string, filetype: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/s3/upload-url`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, filetype }),
    });

    if (!res.ok) {
      throw new Error(`Failed to get presigned URL (${res.status})`);
    }

    const data: PresignedUrlResponse = await res.json();
    return data.uploadUrl;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    throw error;
  }
}

/**
 * Uploads a file directly to AWS S3 using a presigned URL.
 * @param file - The file to upload
 * @returns UploadResult - Contains success flag and uploaded file URL if successful
 */
export async function uploadToS3(file: File): Promise<UploadResult> {
  try {
    // Step 1: Get presigned URL from backend
    const uploadURL = await getPresignedUrl(file.name, file.type);


    // Step 2: Upload the file to S3
    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": file.type,  },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file to S3 (${uploadResponse.status})`);
    }

    // Step 3: Construct final file URL
    // Remove query params (?X-Amz...) to get clean file URL
    const fileUrl = uploadURL.split("?")[0];

    return {
      success: true,
      fileUrl,
    };
  } catch (error: unknown) {
    console.error("S3 upload failed:", error);
    const message = (error && typeof error === 'object' && 'message' in error) ? String((error as { message: unknown }).message) : 'Upload failed';
    return { success: false, error: message };
  }
}
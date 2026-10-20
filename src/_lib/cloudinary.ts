import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 * Returns the secure URL and the public_id of the uploaded asset.
 */
export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    mimetype: string,
    folder: string = "hivehub"
): Promise<{ url: string; publicId: string }> => {
    const resourceType: "image" | "video" | "raw" = mimetype.startsWith("video")
        ? "video"
        : mimetype.startsWith("image")
        ? "image"
        : "raw";

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error || new Error("Cloudinary upload failed"));
                }
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(fileBuffer);
    });
};

/**
 * Delete an asset from Cloudinary by its public_id.
 */
export const deleteFromCloudinary = async (
    publicId: string,
    resourceType: "image" | "video" | "raw" = "image"
): Promise<void> => {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export default cloudinary;

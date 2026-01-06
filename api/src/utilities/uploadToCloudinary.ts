import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        resource_type: "image",
        timeout: 60000, // 60 detik
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Upload ke Cloudinary gagal"));
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

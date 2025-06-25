import cloudinary from "cloudinary";

import dotenv from "dotenv";
dotenv.config();

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (base64, preset) => {
  try {
    const uploadResponse = await cloudinaryV2.uploader.upload(base64, {
      upload_preset: preset,
    });
    return uploadResponse;
  } catch (error) {
    console.error(error);
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinaryV2.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export { cloudinaryV2 as cloudinary };

// export default {
//   cloudinary,
//   uploadImageToCloudinary,
//   deleteImageFromCloudinary,
// };

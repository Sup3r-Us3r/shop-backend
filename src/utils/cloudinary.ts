import { UploadApiOptions } from 'cloudinary';

import cloudinary from '../config/cloudinary';

export async function cloudinaryUpload(path: string[], folder: string) {
  let imageUrl;

  const cloudinaryOptions = {
    folder,
  } as UploadApiOptions;

  const newImagesPromises = path
    .map((path) => new Promise((resolve, reject) => {
      cloudinary.uploader.upload(path, cloudinaryOptions, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data?.secure_url);
        }
      });
    }));

  await Promise.all(newImagesPromises)
    .then((imageUrlData) => {
      imageUrl = imageUrlData;
    })
    .catch((err) => err);

  return imageUrl;
}

export async function cloudinaryUpdate(
  publicId: string[],
  path: string[],
  folder: string
) {
  await cloudinaryDestroy(publicId);
  await cloudinaryUpload(path, folder);
}

export async function cloudinaryDestroy(publicId: string[]) {
  const deletedImagesPromises = publicId
      .map((id) => new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(id, (err) => {
          if (err) {
            return reject(err);
          } else {
            return resolve();
          }
        });
      }));

    Promise.all(deletedImagesPromises)
      .then(() => true)
      .catch((err) => err);
}

import 'dotenv/config';

import { UploadApiOptions } from 'cloudinary';

import cloudinary from '../config/cloudinary';

export interface IImageData {
  public_id: string;
  url: string;
}

export async function cloudinarySingleUpload(
  filePath: string,
  folder: string
): Promise<IImageData> {
  let imageData: IImageData = {
    public_id: '',
    url: '',
  };

  const cloudinaryOptions = {
    folder,
  } as UploadApiOptions;

  try {
    await cloudinary.uploader
      .upload(filePath, cloudinaryOptions, (err, data) => {
        if (err) {
          return err;
        }

        if (data) {
          imageData = {
            public_id: data.public_id,
            url: data.secure_url,
          };
        }
      });

    return imageData;
  } catch (err) {
    return err;
  }
}

export async function cloudinaryMultipleUpload(
  filePath: string[],
  folder: string
) {
  let imageData: IImageData[] = [];

  const cloudinaryOptions = {
    folder,
  } as UploadApiOptions;

  const newImagesPromises: Promise<IImageData>[] = filePath
    .map((path) => new Promise((resolve, reject) => {
      cloudinary.uploader.upload(path, cloudinaryOptions, (err, data) => {
        if (err) {
          return reject(err);
        }

        if (data) {
          return resolve({
            public_id: data.public_id,
            url: data.secure_url,
          });
        }
      });
    }));

  await Promise.all(newImagesPromises)
    .then((allImages) => {
      imageData = allImages;
    })
    .catch((err) => err);

  return imageData;
}

export async function cloudinarySingleUpdate(
  publicId: string,
  filePath: string,
  folder: string
) {
  await cloudinarySingleDestroy(publicId);
  const response = await cloudinarySingleUpload(filePath, folder);

  return response;
}

export async function cloudinaryMultipleUpdate(
  publicId: string[],
  filePath: string[],
  folder: string
) {
  await cloudinaryMultipleDestroy(publicId);
  const response = await cloudinaryMultipleUpload(filePath, folder);

  return response;
}

export async function cloudinarySingleDestroy(publicId: string) {
  const response: Promise<boolean> = await cloudinary.uploader
    .destroy(publicId, (err) => {
      if (err) {
        return false;
      }

      return true;
    });

  return response;
}

export async function cloudinaryMultipleDestroy(publicId: string[]) {
  const deletedImagesPromises = publicId
      .map((id) => new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(id, (err) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }));

    await Promise.all(deletedImagesPromises)
      .then((response) => response)
      .catch((err) => err);
}

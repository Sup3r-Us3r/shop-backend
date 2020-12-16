import { Request, Response } from 'express';

import knex from '../../database/connection';

import {
  cloudinaryMultipleUpload,
  cloudinaryMultipleUpdate,
  cloudinaryMultipleDestroy,
  IImageData,
} from '../../utils/cloudinary';

interface IProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_id: number;
  public_id: string;
  url: string;
  created_at?: Date;
}

class ProductController {
  async create(req: Request, res: Response) {
    const { name, price, category, description }: IProduct = req.body;

    try {
      if (!name || !price || !category || !description) {
        return res.status(400).json({ error: 'All fields are mandatory' });
      }

      const serializedUserData = {
        name,
        price: Number(price),
        category,
        description,
      }

      const createProduct = await knex('tb_product AS P')
        .insert(serializedUserData)
        .returning('P.id')

      if (createProduct) {
        const requestImages = req.files as Express.Multer.File[];
        const imagesPath = requestImages.map((filePath) => filePath.path);

        const uploadImages =
          await cloudinaryMultipleUpload(imagesPath, 'product');

        const serializedImagesData = uploadImages.map((image: IImageData) => ({
          product_id: createProduct[0],
          public_id: image.public_id,
          url: image.url,
        }));

        await knex('tb_image').insert(serializedImagesData);
      }

      return res.sendStatus(201);
    } catch (err) {
      return res.status(500).json({ error: 'Error creating user' });
    }
  }

  async update (req: Request, res: Response) {
    const { id } = req.params;
    const { removeImages } = req.query;
    const { name, price, category, description }: IProduct = req.body;

    try {
      const productExists = await knex('tb_product AS P')
        .join('tb_image AS I', 'P.id', 'I.product_id')
        .where({ 'P.id': id })
        .select([
          'P.id',
          'P.name',
          'P.price',
          'P.category',
          'P.description',
          'I.id AS image_id',
          'I.public_id',
          'I.url',
        ]);

      if (!productExists) {
        return res.status(400).json({ error: 'Product does not exist' });
      }

      const serializedProductData = {
        name: name ? name : productExists[0].name,
        price: price ? price : productExists[0].price,
        category: category ? category : productExists[0].category,
        description: description ? description : productExists[0].description,
      }

      await knex('tb_product')
        .where({ id })
        .update(serializedProductData);

      const idsOfImagesFromRemove = String(removeImages)
        .split(',')
        .map((id) => Number(id));

      const publicIdsFromRemove = productExists.filter((product: IProduct) => {
        return idsOfImagesFromRemove.includes(product.image_id);
      }).map((product: IProduct) => product.public_id);

      const requestImages = req.files as Express.Multer.File[];
      const imagesPath = requestImages.map((filePath) => filePath.path);

      const serializedImagesData = await cloudinaryMultipleUpdate(
        publicIdsFromRemove,
        imagesPath,
        'product',
      );

      const newImages = serializedImagesData.map((image: IImageData) => ({
        product_id: id,
        public_id: image.public_id,
        url: image.url,
      }));

      const imagesKept = productExists.filter((product: IProduct) => {
        return !idsOfImagesFromRemove.includes(product.image_id);
      }).map((product: IProduct) => ({
        public_id: product.public_id,
        url: product.url,
      }));

      await knex('tb_image AS I')
        .whereIn('I.id', idsOfImagesFromRemove)
        .delete();

      await knex('tb_image')
        .insert(newImages);

      return res.json({
        id,
        ...serializedProductData,
        images: [
          ...imagesKept,
          ...serializedImagesData,
        ],
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error updating data' });
    }
  }

  async delete (req: Request, res: Response) {
    const { id } = req.params;

    try {
      const productExists = await knex('tb_product AS P')
        .join('tb_image AS I', 'P.id', 'I.product_id')
        .where({ 'P.id': id })
        .select('I.public_id');

      if (productExists.length === 0) {
        return res.status(400).json({ error: 'Product does not exist' });
      }

      const publicIdsFromRemove = productExists
        .map((product: IProduct) => product.public_id);

      await cloudinaryMultipleDestroy(publicIdsFromRemove);

      await knex('tb_product')
        .where({ id })
        .delete();

      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json({ error: 'Error when deleting product' });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const product = await knex('tb_product')
        .where({ id })
        .first();

      const productImages = await knex('tb_image')
        .where({ product_id: id });

      if (!product || !productImages) {
        return res.status(400)
          .json({ error: 'Product does not exist' });
      }

      const serializedProductData = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        images: productImages
          .filter((image: { product_id: number }) =>
            image.product_id === product.id,
          ),
      };

      return res.json(serializedProductData);
    } catch (err) {
      return res.status(500)
        .json({ error: 'Error listing product' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const products = await knex('tb_product');
      const productsImages = await knex('tb_image');

      if (!products || !productsImages) {
        return res.status(400)
          .json({ error: 'Error when listing products' });
      }

      const serializedProductsData = products.map((product: IProduct) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        images: productsImages
          .filter((image: { product_id: number }) =>
            image.product_id === product.id
          ),
        created_at: product.created_at,
      }));

      return res.json(serializedProductsData);
    } catch (err) {
      return res.status(500)
        .json({ error: 'Error when listing products' });
    }
  }
}

export default new ProductController();

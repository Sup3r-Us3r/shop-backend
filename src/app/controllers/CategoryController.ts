import { Request, Response } from 'express';

import knex from '../../database/connection';

import {
  cloudinarySingleUpload,
  cloudinarySingleUpdate,
} from '../../utils/cloudinary';

interface ICategory {
  name: string;
  image: {
    public_id: string;
    url: string;
  };
}

class CategoryController {
  async create(req: Request, res: Response) {
    const { name }: ICategory = req.body;

    try {
      const categoryExists = await knex('tb_category')
        .where({ name })
        .first();

      if (categoryExists) {
        return res.status(400).json({ error: 'Category already exists'})
      }

      const serializedCategoryData = {
        name,
        image: await cloudinarySingleUpload(req.file.path, 'category'),
      }

      await knex('tb_category').insert(serializedCategoryData);

      return res.sendStatus(201);
    } catch (err) {
      return res.status(500).json({ error: 'Error creating category' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name }: ICategory = req.body;

    try {
      const categoryExists = await knex('tb_category')
        .where({ id })
        .first() as ICategory;

      if (!categoryExists) {
        return res.status(400).json({ error: 'Category does not exist'})
      }

      const serializedCategoryData = {
        name: name ? name : categoryExists.name,
        image: req.file
          ? await cloudinarySingleUpdate(
            categoryExists.image.public_id,
            req.file.path,
            'category')
          : categoryExists.image,
      }

      const response = await knex('tb_category AS C')
        .where({ id })
        .update(serializedCategoryData)
        .returning([
          'C.id',
          'C.name',
          'C.image',
        ]);

      return res.json(...response);
    } catch (err) {
      return res.status(500).json({ error: 'Error updating data' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const categoryExists = await knex('tb_category')
        .where({ id })
        .first() as ICategory;

      if (!categoryExists) {
        return res.status(400).json({ error: 'Category does not exist'})
      }

      await knex('tb_category')
        .where({ id })
        .delete();

      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json({ error: 'Error when deleting category' });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const response = await knex('tb_category AS C')
        .where({ id })
        .select([
          'C.id',
          'C.name',
          'C.image',
        ])
        .first();

      if (!response) {
        return res.status(400).json({ error: 'Category does not exist' });
      }

      return res.json(response);
    } catch (err) {
      return res.status(500).json({ error: 'Error while listing category' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const categories = await knex('tb_category AS C')
        .select(
          'C.id',
          'C.name',
          'C.image',
        );

      if (!categories) {
        return res.status(400)
          .json({ error: 'Error error when listing categories' });
      }

      return res.json(categories);
    } catch (err) {
      return res.status(500)
        .json({ error: 'Error error when listing categories' });
    }
  }
}

export default new CategoryController();

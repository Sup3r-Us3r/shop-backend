import { Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';

import knex from '../../database/connection';

import { cloudinaryUpload } from '../../utils/cloudinary';
// import cloudinary from '../../config/cloudinary';

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  photo?: string;
  recoverycode?: string;
  created_at?: Date;
}

class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password }: IUser = req.body;

    try {
      const userExists = await knex('tb_user')
        .where({ email })
        .first();

      if (userExists) {
        return res.status(409).json({ error: 'Account already exists' });
      }

      const serializedUserData = {
        name,
        email,
        password: hashSync(password, 8),
        photo: req.file
          ? await cloudinaryUpload([req.file.path], 'user')
          : process.env.DEFAULT_PHOTO,
      }

      const create = await knex('tb_user').insert(serializedUserData);

      if (create) {
        return res.sendStatus(201);
      }
    } catch (err) {
      return res.status(500).json({ error: 'Account already exists' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password }: IUser = req.body;

    try {
      const userExists = await knex('tb_user')
        .where({ email })
        .first() as IUser;

      if (!userExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      const passwordHashed = userExists.password;
      const passwordCheck = compareSync(password, passwordHashed);
      
      if (!passwordCheck) {
        return res.status(400).json({ error: 'Wrong password' });
      }

      const serializedUserData = {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        photo: userExists.photo,
      }

      return res.json(serializedUserData);
    } catch (err) {
      return res.status(500).json({ error: 'Error when logging in user' });
    }
  }

  async update (req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password }: IUser = req.body;

    try {
      const userExists = await knex('tb_user')
        .where({ id })
        .first() as IUser;

      if (!userExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      const response = await knex('tb_user AS U')
        .where({ id })
        .update({
          name: name ? name: userExists.name,
          email: email ? email: userExists.email,
          password: password ? hashSync(password, 8) : userExists.password,
          photo: req.file
            ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
            : userExists.photo,
        })
        .returning('*');

      return res.json(...response);
    } catch (err) {
      return res.status(500).json({ error: 'Error updating data' });
    }
  }

  async delete (req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userExists = await knex('tb_user')
        .where({ id })
        .first();

      if (!userExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      await knex('tb_user AS U')
        .where({ id })
        .delete();

      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json({ error: 'Error when deleting account' });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userExists = await knex('tb_user')
        .where({ id })
        .first() as IUser;

      if (!userExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      const serializedUserData = {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        photo: userExists.photo,
      }

      return res.json(serializedUserData);
    } catch (err) {
      return res.status(500).json({ error: 'Error while listing user' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const users = await knex('tb_user AS U')
        .select(
          'U.id',
          'U.name',
          'U.email',
          'U.photo',
          'U.created_at',
        );

      if (!users) {
        return res.status(400)
          .json({ error: 'Error error when listing users' });
      }

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Error error when listing users' });
    }
  }
}

export default new UserController();

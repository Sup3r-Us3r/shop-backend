import { Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';

import knex from '../../database/connection';

import {
  cloudinarySingleUpload,
  cloudinarySingleUpdate,
  cloudinarySingleDestroy,
} from '../../utils/cloudinary';

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  photo: {
    public_id: string;
    url: string;
  };
  recoverycode?: string;
  created_at?: Date;
}

class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password }: IUser = req.body;

    try {
      const accountExists = await knex('tb_user')
        .where({ email })
        .first();

      if (accountExists) {
        return res.status(409).json({ error: 'Account already exists' });
      }

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are mandatory' });
      }

      const serializedUserData = {
        name,
        email,
        password: hashSync(password, 8),
        photo: req.file
          ? await cloudinarySingleUpload(req.file.path, 'user')
          : {
            public_id: process.env.DEFAULT_PHOTO_PUBLIC_ID,
            url: process.env.DEFAULT_PHOTO_URL,
          },
      }

      await knex('tb_user').insert(serializedUserData);

      return res.sendStatus(201);
    } catch (err) {
      return res.status(500).json({ error: 'Error creating user' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password }: IUser = req.body;

    try {
      const accountExists = await knex('tb_user')
        .where({ email })
        .first() as IUser;

      if (!accountExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      const passwordHashed = accountExists.password;
      const passwordCheck = compareSync(password, passwordHashed);
      
      if (!passwordCheck) {
        return res.status(400).json({ error: 'Wrong password' });
      }

      const serializedUserData = {
        id: accountExists.id,
        name: accountExists.name,
        email: accountExists.email,
        photo: accountExists.photo,
        created_at: accountExists.created_at,
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
      const accountExists = await knex('tb_user')
        .where({ id })
        .first() as IUser;

      if (!accountExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      const serializedUserData = {
        name: name ? name: accountExists.name,
        email: email ? email: accountExists.email,
        password: password ? hashSync(password, 8) : accountExists.password,
        photo: req.file
          ? accountExists.photo.public_id !== process.env.DEFAULT_PHOTO_PUBLIC_ID
            ? await cloudinarySingleUpdate(
                accountExists.photo.public_id,
                req.file.path,
                'user',
              )
            : await cloudinarySingleUpload(
                req.file.path,
                'user',
              )
          : accountExists.photo,
      }

      const response = await knex('tb_user AS U')
        .where({ id })
        .update(serializedUserData)
        .returning([
          'U.id',
          'U.name',
          'U.email',
          'U.photo',
          'U.created_at',
        ]);

      return res.json(...response);
    } catch (err) {
      return res.status(500).json({ error: 'Error updating data' });
    }
  }

  async delete (req: Request, res: Response) {
    const { id } = req.params;

    try {
      const accountExists = await knex('tb_user')
        .where({ id })
        .first() as IUser;

      if (!accountExists) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      // Do not remove the user's default photo in cloudinary
      if (accountExists.photo.public_id !== process.env.DEFAULT_PHOTO_PUBLIC_ID)
        {
          await cloudinarySingleDestroy(accountExists.photo.public_id);
        }

      await knex('tb_user')
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
      const user = await knex('tb_user AS U')
        .where({ id })
        .select([
          'U.id',
          'U.name',
          'U.email',
          'U.photo',
          'U.created_at',
        ])
        .first();

      if (!user) {
        return res.status(400).json({ error: 'Account does not exist' });
      }

      return res.json(user);
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
          .json({ error: 'Error when listing users' });
      }

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Error when listing users' });
    }
  }
}

export default new UserController();

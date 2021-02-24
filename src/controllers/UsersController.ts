import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';

class UsersController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    try {
      const usersRepository = getCustomRepository(UsersRepository);

      const userExists = await usersRepository.findOne({ email });

      if (userExists) return response.status(400).json({
        error: 'User already exists'
      });

      const user = usersRepository.create({
        name,
        email
      });

      await usersRepository.save(user);

      return response.status(201).json(user);
    } catch (err) {
      return response.status(500).json({
        error: 'Error when trying to save user'
      });
    }
  }
}

export { UsersController };
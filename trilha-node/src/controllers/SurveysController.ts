import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { SurveysRepository } from '../repositories/SurveysRepository';

import { AppError } from '../errors/AppError';
class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({
      title,
      description
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    try {
      const all = await surveysRepository.find();

      return response.status(200).json(all);
    } catch (err) {
      throw new AppError('Error when trying to get surveys', 500);
    }
  }
}

export { SurveysController };
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';

class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    try {
      const surveysRepository = getCustomRepository(SurveysRepository);

      const survey = surveysRepository.create({
        title,
        description
      });

      await surveysRepository.save(survey);

      return response.status(201).json(survey);
    } catch (err) {
      return response.status(500).json({
        error: 'Error when trying to save survey'
      });
    }
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    try {
      const all = await surveysRepository.find();

      return response.status(200).json(all);
    } catch (err) {
      return response.status(500).json({
        error: 'Error when trying to get surveys'
      });
    }
  }
}

export { SurveysController };
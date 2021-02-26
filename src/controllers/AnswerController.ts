import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { AppError } from '../errors/AppError';

import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController {
  async execute(request: Request, response: Response) {
    const value = request.params.value;
    const surveyId = request.query.id;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(surveyId)
    });

    if (!surveyUser) throw new AppError('Survey User not found');

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }
}

export { AnswerController };
import path from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

import SendMailService from '../services/SendMailService';

import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await usersRepository.findOne({ email });

    if (!userExists) throw new AppError('User not found')

    const surveyExists = await surveysRepository.findOne({ id: survey_id });

    if (!surveyExists) throw new AppError('Survey not found')

    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: userExists.id, value: null },
      relations: ['user', 'survey']
    });

    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      id: '',
      link: process.env.URL_MAIL
    };

    if (surveyUserExists) {
      variables.id = surveyUserExists.id;

      await SendMailService.execute(email, surveyExists.title, variables, npsPath);

      return response.status(200).json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailService.execute(email, surveyExists.title, variables, npsPath);

    return response.status(200).json(surveyUser);
  }
}

export { SendMailController };
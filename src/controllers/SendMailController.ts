import path from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

import SendMailService from '../services/SendMailService';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const userExists = await usersRepository.findOne({ email });

    if (!userExists) return response.status(400).json({
      error: 'User not found'
    });

    const surveyExists = await surveysRepository.findOne({ id: survey_id });

    if (!surveyExists) return response.status(400).json({
      error: 'Survey not found'
    });

    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      user_id: userExists.id,
      link: process.env.URL_MAIL
    }

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: [
        { user_id: userExists.id },
        { value: null }
      ],
      relations: ['user', 'survey']
    })

    if (surveyUserExists) {
      await SendMailService.execute(email, surveyExists.title, variables, npsPath);

      return response.status(200).json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, surveyExists.title, variables, npsPath);

    return response.status(200).json(surveyUser);
  }
}

export { SendMailController };
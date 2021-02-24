import crypto from 'crypto';
import request from 'supertest';

import { app } from '../app';
import createConnection from '../database';

const random = () => crypto.randomBytes(15).toString('hex');

const title = random();
const description = random();

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await createConnection();

    await connection.runMigrations();
  });

  it('Shoud be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title,
      description
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Shoud be able to get all surveys', async () => {
    await request(app).post('/surveys').send({
      title: random(),
      description: random()
    });

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(2);
  });
});
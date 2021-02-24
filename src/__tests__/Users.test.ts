import crypto from 'crypto';
import request from 'supertest';

import { app } from '../app';
import createConnection from '../database';

const random = () => crypto.randomBytes(15).toString('hex');

const name = random();
const email = random();

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();

    await connection.runMigrations();
  });

  it('Shoud be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name,
      email
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a user with an email that already exists', async () => {
    const response = await request(app).post('/users').send({
      name,
      email
    });

    expect(response.status).toBe(400);
  });
});
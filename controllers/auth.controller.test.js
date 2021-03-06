require('dotenv').config();

const request = require('supertest');
const app = require('../server.js');

const ROOT_PATH = '/wsnv21/api/auth';

describe(`TEST ${ROOT_PATH}`, () => {
  it('Should login', (done) => {
    request(app).post(`${ROOT_PATH}/login`).send({
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    })
      .then((response) => {
        expect(response.status).toBe(201);
      })
      .finally(() => done());
  });

  it('Should logout', (done) => {
    request(app).delete(`${ROOT_PATH}/logout`)
      .then((response) => {
        expect(response.status).toBe(200);
      })
      .finally(() => done());
  });
});

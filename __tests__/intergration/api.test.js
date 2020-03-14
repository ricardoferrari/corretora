'use strict';
const request = require('supertest');

const app = require('../../app');

// Request data
let jsonData = {};

describe('API', () => {
  beforeEach(() => {
    // Data needed for a valid quotation request
    jsonData = {
      request: {
        nome: 'José da Silva',
        nascimento: '23/11/1989',
        endereco: {
          logradouro: 'Rua das Flores, 15',
          bairro: 'Jardim Floresta',
          cep: '14500-000',
          cidade: 'São Paulo',
        },
        coberturas: [
          '01',
          '03',
          '04',
        ],
      },
    };
  });

  it('should fail when the person is less than 18 years old', async() => {
    jsonData.request.nascimento = '23/11/2002';
    const response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('É necessário possuir mais de 18 anos!');
  });

  it('should fail when the city is not allowed', async() => {
    jsonData.request.endereco.cidade = 'Pindamonhangaba';
    const response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Cidade não cadastrada!');
  });

  it('should fail when the CEP is invalid', async() => {
    // CEP with illegal characters
    jsonData.request.endereco.cep = 'A3693-020';
    let response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('CEP inválido!');
    // CEP length exceded
    jsonData.request.endereco.cep = '113693-020';
    response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('CEP inválido!');
  });

  it('should fail when there is no mandatory coverage on the request', async() => {
    // Coverage data not mandatory
    jsonData.request.coberturas[0] = '02';
    let response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Cobertura obrigatória inexistente!');
  });

  it('should fail when the number of coverages has excedded', async() => {
    // Coverage length excedded the limit of 4
    jsonData.request.coberturas = ['01', '02', '03', '04', '05'];
    let response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Número máximo de coberturas excedido!');
  });

  it('should return ok when all data are valid', async() => {
    const response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(200);
    expect(response.body.response).toHaveProperty('premio');
    expect(response.body.response).toHaveProperty('parcelas');
    expect(response.body.response).toHaveProperty('valor_parcelas');
    expect(response.body.response).toHaveProperty('primeiro_vencimento');
    expect(response.body.response).toHaveProperty('cobertura_total');
  });

  it('should return prize with discounts when all data are valid', async() => {
    // Coverage total value = 410
    jsonData.request.coberturas = ['01', '05', '08', '09'];
    let response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(200);
    expect(response.body.response.premio).toBe(410);
    // Coverage total value = 410 plus addition of 40% for 25 years old
    jsonData.request.nascimento = '23/11/1994';
    response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(200);
    expect(response.body.response.premio).toBe(574);
    expect(response.body.response.parcelas).toBe(2);
    expect(response.body.response.valor_parcelas).toBe(287);
    // Coverage total value = 410 less discount of 16% for 38 years old
    jsonData.request.nascimento = '15/03/1981';
    response = await request(app)
      .post('/price')
      .send(jsonData);
    expect(response.status).toBe(200);
    expect(response.body.response.premio).toBe(344.4);
    expect(response.body.response.parcelas).toBe(1);
    expect(response.body.response.valor_parcelas).toBe(344.4);
  });

});

const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { tenantOne, insertTenant } = require('../fixtures/tenant.fixture');

const adminAccessToken = 'TOKEN has to be gen from the token fixture';

setupTestDB();

describe('Tenant routes', () => {
  describe('POST /v1/tenants', () => {
    let newTenant;

    beforeEach(() => {
      newTenant = {
        tenantNm: faker.name.findName(),
        compNm: faker.name.findName(),
      };
    });

    test('should return 201 and successfully create new tenant if data is ok', async () => {
      await insertTenant([tenantOne]);

      const res = await request(app)
        .post('/v1/tenants')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTenant)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 3,
        warningStatus: 0,
      });
    });
  });
});

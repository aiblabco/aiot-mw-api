const faker = require('faker');
const tenantService = require('../../src/services/tenant.service');

const tenantOne = {
  tenantnm: faker.name.findName(),
  compnm: faker.name.findName,
};

const insertTenant = async (tenantData) => {
  return tenantService.addTenant(tenantData);
};

module.exports = {
  tenantOne,
  insertTenant,
};

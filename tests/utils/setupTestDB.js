// const config = require('../../src/config/config');

// 테스트 DB에 생성하고 삭제하는 테스트를 진행하는 경우 여기서 DB를 리셋하도록 한다.

const setupTestDB = () => {
  beforeAll(async () => {
    // console.log('before_all_log');
  });

  beforeEach(async () => {
    // delete all test data
    // console.log('before_each_log');
  });

  afterAll(async () => {
    // console.log('after_all_log');
  });
};

module.exports = setupTestDB;

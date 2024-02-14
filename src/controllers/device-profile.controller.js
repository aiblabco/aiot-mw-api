const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { deviceProfileService, edgexService, deviceModelService, objectTypeService } = require('../services');
const ApiError = require('../utils/ApiError');

const throwDeviceProfileNotFound = (key) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'not_found', `the device profile '${key}' is not found`);
};

const throwDeviceProfileExist = (key, extraInfo = '') => {
  if (extraInfo) {
    extraInfo = ` (${extraInfo})`;
  }
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    'device_profile_exist',
    `the device profile '${key}' is already exist.${extraInfo}`,
  );
};

const addDeviceProfile = catchAsync(async (req, res) => {
  /**
   * 1. DB 확인
   * 1.1 ObjectType 확인
   * 2. Edgex 확인
   * 3. Edgex 저장
   * 4. DB 저장
   */
  const reqDeviceProfile = req.body;
  // DB에 존재 확인
  const oldDeviceProfile = await deviceProfileService.getDeviceProfileByName(reqDeviceProfile.name);
  if (oldDeviceProfile) {
    throwDeviceProfileExist(reqDeviceProfile.name);
  }
  for (const resource of reqDeviceProfile.resources) {
    if (resource.type === 'Object') {
      if (!(await objectTypeService.getObjectTypeByName(resource.value_type))) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'object_type_not_found',
          `the specified objectType '${resource.value_type}' is not found`,
        );
      }
    }
  }
  // edgex에 존재 확인
  try {
    const oldDeviceProfileFromEdgex = await edgexService.getDeviceProfileByName(reqDeviceProfile.name);
    if (oldDeviceProfileFromEdgex) {
      throwDeviceProfileExist(reqDeviceProfile.name, 'edgex');
    }
  } catch (e) {
    if (e.response.status !== httpStatus.NOT_FOUND) {
      throw e;
    }
  }
  // edgex에 추가
  await edgexService.addDeviceProfile(await deviceModelService.genDeviceProfileForEdgex(reqDeviceProfile));
  // DB에 추가
  await deviceProfileService.addDeviceProfile(req.body);
  const device = await deviceProfileService.getDeviceProfileByName(reqDeviceProfile.name);
  res.status(httpStatus.CREATED).json(device);
});

const deleteDeviceProfileByName = catchAsync(async (req, res) => {
  /**
   * 1. DB 확인
   * 2. Edgex 확인
   * 3. Edgex 삭제
   * 4. DB 삭제
   */
  const profileName = req.params.name;
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(profileName);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(profileName);
  }
  // edgex에 존재 확인
  try {
    const oldDeviceProfileFromEdgex = await edgexService.getDeviceProfileByName(profileName);
    if (oldDeviceProfileFromEdgex) {
      // 있으면 삭제
      await edgexService.deleteDeviceProfileByName(profileName);
    }
  } catch (e) {
    if (e.response.status !== httpStatus.NOT_FOUND) {
      throw e;
    }
  }
  // DB 삭제
  await deviceProfileService.deleteDeviceProfileByName(profileName);
  return res.status(httpStatus.NO_CONTENT).send();
});

const updateDeviceProfileByName = catchAsync(async (req, res) => {
  /**
   * 1. DB 확인
   * 1.1 ObjectType 확인
   * 2. Edgex 확인
   * 3. Edgex 업데이트
   * 4. DB 업데이트
   */
  const reqDeviceProfile = req.body;
  reqDeviceProfile.name = req.params.name;
  const oldDeviceProfile = await deviceProfileService.getDeviceProfileByName(reqDeviceProfile.name);
  if (!oldDeviceProfile) {
    throwDeviceProfileNotFound(reqDeviceProfile.name);
  }
  try {
    await edgexService.getDeviceProfileByName(reqDeviceProfile.name);
  } catch (e) {
    if (e.response.status === httpStatus.NOT_FOUND) {
      throwDeviceProfileNotFound(reqDeviceProfile.name);
    } else {
      throw e;
    }
  }
  for (const resource of reqDeviceProfile.resources) {
    if (resource.type === 'Object') {
      if (!(await objectTypeService.getObjectTypeByName(resource.value_type))) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'object_type_not_found',
          `the specified objectType '${resource.value_type}' is not found`,
        );
      }
    }
  }
  await edgexService.updateDeviceProfile(await deviceModelService.genDeviceProfileForEdgex(reqDeviceProfile));
  await deviceProfileService.updateDeviceProfileByName(reqDeviceProfile.name, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDeviceProfileByName = catchAsync(async (req, res) => {
  const profileName = req.params.name;
  const deviceProfile = await deviceProfileService.getDeviceProfileByName(profileName);
  if (!deviceProfile) {
    throwDeviceProfileNotFound(profileName);
  }
  res.send(deviceProfile);
});

const getDeviceProfiles = catchAsync(async (req, res) => {
  const deviceProfiles = await deviceProfileService.getDeviceProfiles();
  res.send(deviceProfiles);
});

module.exports = {
  addDeviceProfile,
  getDeviceProfileByName,
  getDeviceProfiles,
  deleteDeviceProfileByName,
  updateDeviceProfileByName,
  throwDeviceProfileNotFound,
  throwDeviceProfileExist,
};

const { objectTypeDb } = require('../daos');

const addObjectType = async (objectTypeData) => {
  objectTypeData.object_properties = JSON.stringify(objectTypeData.object_properties);
  return await objectTypeDb.createOne(objectTypeData);
};

const updateObjectTypeByName = async (name, newObjectTypeData) => {
  newObjectTypeData.object_properties = JSON.stringify(newObjectTypeData.object_properties);
  return await objectTypeDb.updateByName(name, newObjectTypeData);
};

const deleteObjectTypeByName = async (name) => {
  return await objectTypeDb.deleteByName(name);
};

const getObjectTypeByName = async (name) => {
  const objectType = await objectTypeDb.selectByName(name);
  if (objectType) {
    objectType.object_properties = JSON.parse(objectType.object_properties);
  }
  return objectType;
};

const getObjectTypes = async () => {
  const objectTypes = await objectTypeDb.selectAll();
  objectTypes.forEach((objectType) => {
    objectType.object_properties = JSON.parse(objectType.object_properties);
  });
  return objectTypes;
};

module.exports = {
  addObjectType,
  updateObjectTypeByName,
  deleteObjectTypeByName,
  getObjectTypeByName,
  getObjectTypes,
};

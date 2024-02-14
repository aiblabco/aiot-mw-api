const config = require('../config/config');

function genDeviceResource(resource) {
  const result = {
    name: resource.name,
    description: resource.description,
    isHidden: false,
    tag: '',
    properties: {
      valueType: ['Object', 'Binary'].includes(resource.type) ? 'Object' : resource.value_type,
      readWrite: resource.read_write,
      units: resource.units,
      mediaType: resource.media_type,
      // default below
      minimum: '',
      maximum: '',
      defaultValue: '0',
      mask: '',
      shift: '',
      scale: '',
      offset: '',
      base: '',
      assertion: '',
    },
  };

  return result;
}

function genDeviceCommand(command) {
  const result = {
    name: command.name,
    isHidden: false,
    readWrite: command.read_write,
    resourceOperations: [],
  };

  command.resources.forEach((name) => {
    result.resourceOperations.push({
      deviceResource: name,
      defaultValue: '',
      mappings: null,
    });
  });

  return result;
}

const genDeviceProfileForEdgex = async (deviceModelData) => {
  const deviceResources = [];
  const deviceCommands = [];

  deviceModelData.resources.forEach((resource) => {
    deviceResources.push(genDeviceResource(resource));
  });
  deviceModelData.commands.forEach((command) => {
    deviceCommands.push(genDeviceCommand(command));
  });

  const newDeviceModelData = [
    {
      apiVersion: 'v2',
      profile: {
        name: deviceModelData.name,
        description: deviceModelData.description,
        manufacturer: deviceModelData.manufacturer,
        model: deviceModelData.model,
        labels: deviceModelData.labels,
        deviceResources,
        deviceCommands,
      },
    },
  ];
  return newDeviceModelData;
};

const genDeviceForEdgex = async (deviceData) => {
  const newDeviceModelData = [
    {
      apiVersion: 'v2',
      device: {
        name: deviceData.dev_id,
        description: deviceData.description,
        adminState: 'UNLOCKED',
        operatingState: 'UP',
        labels: ['aiotmwapi', 'device'],
        location: JSON.stringify({
          lat: deviceData.latitude,
          long: deviceData.longitude,
        }),
        serviceName: config.mqttServiceName,
        profileName: deviceData.device_profile,
        autoEvents: [],
        protocols: {
          mqtt: {
            CommandTopic: `DEVICE/${deviceData.dev_id}`,
          },
        },
        notify: false,
      },
    },
  ];
  return newDeviceModelData;
};

module.exports = {
  genDeviceProfileForEdgex,
  genDeviceForEdgex,
};

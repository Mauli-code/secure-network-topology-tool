const data = require("./data");

function findDeviceByName(name) {
    const devices = data.loadDevices();
    for (const device of devices) {
        if (device.name.toLowerCase() === name.trim().toLowerCase()) {
            return device;
        }
    }
    return null;
}

function getNextDeviceId(devices) {
    let id = 1;
    devices.forEach(function(device) {
        if (device.id >= id) {
            id = device.id + 1;
        }
    });
    return id;
}

function addDevice(device) {
    const devices = data.loadDevices();
    devices.push(device);
    data.saveDevices(devices);
}

function removeDevice(name) {
    const devices = data.loadDevices();
    const normalizedName = name.trim().toLowerCase();
    const remainingDevices = devices.filter(function(device) {
        return device.name.toLowerCase() !== normalizedName;
    });

    data.saveDevices(remainingDevices);
}

module.exports = {
    findDeviceByName,
    getNextDeviceId,
    addDevice,
    removeDevice
};

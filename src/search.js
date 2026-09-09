const data = require("./data");
const deviceModule = require("./device");

function searchByName(name) {
    return deviceModule.findDeviceByName(name);
}

function searchByIP(ip) {
    const devices = data.loadDevices();
    const searchIP = ip.trim();
    return devices.filter(function(device) {
        return device.ip === searchIP;
    });
}

function displayDevice(device) {
    console.log("ID: " + device.id);
    console.log("Name: " + device.name);
    console.log("Type: " + device.type);
    console.log("IP: " + device.ip);
}

module.exports = {
    searchByName,
    searchByIP,
    displayDevice
};

const data = require("./data");

function checkConnectivity() {
    const devices = data.loadDevices();
    const connections = data.loadConnections();

    let connectedDevices = 0;
    let disconnectedDevices = 0;

    devices.forEach(function(device) {
        let isConnected = false;
        connections.forEach(function(connection) {
            if (
                connection.source.toLowerCase() === device.name.toLowerCase() ||
                connection.destination.toLowerCase() === device.name.toLowerCase()
            ) {
                isConnected = true;
            }
        });

        if (isConnected) {
            connectedDevices++;
        } else {
            disconnectedDevices++;
        }
    });

    console.log("\n========== Connectivity Check ==========");
    console.log("Total Devices: " + devices.length);
    console.log("Connected Devices: " + connectedDevices);
    console.log("Disconnected Devices: " + disconnectedDevices);
    console.log("========================================");

    if (disconnectedDevices > 0) {
        console.log("Security Warning: " + disconnectedDevices + " device(s) have no connections.");
    }
}

module.exports = {
    checkConnectivity
};

const fs = require("fs");
const data = require("./data");
const deviceModule = require("./device");

function generateTopology() {
    const devices = data.loadDevices();
    const connections = data.loadConnections();

    let report = "Network Topology Report\n";
    report += "=======================\n\n";

    const topology = {};
    let invalidConnections = 0;
    let disconnectedDevices = 0;

    devices.forEach(function(device) {
        topology[device.name] = [];
    });

    connections.forEach(function(connection) {
        const sourceDevice = deviceModule.findDeviceByName(connection.source);
        const destinationDevice = deviceModule.findDeviceByName(connection.destination);

        if (sourceDevice === null || destinationDevice === null) {
            invalidConnections++;
            console.log(
                "Security Warning: Connection contains an unknown device."
            );
            return;
        }

        topology[sourceDevice.name].push(`${destinationDevice.name} (${destinationDevice.type}, IP: ${destinationDevice.ip})`);
        topology[destinationDevice.name].push(`${sourceDevice.name} (${sourceDevice.type}, IP: ${sourceDevice.ip})`);
    });

    let mostConnectedDevice = null;
    let maxConnections = 0;

    for (const deviceName in topology) {
        const count = topology[deviceName].length;
        if (count > maxConnections) {
            maxConnections = count;
            mostConnectedDevice = deviceName;
        }
    }

    report += "Devices: " + devices.length + "\n";
    report += "Connections: " + connections.length + "\n";

    console.log("Topology Summary");
    console.log("----------------");
    console.log("Devices: " + devices.length);
    console.log("Connections: " + connections.length);

    if (mostConnectedDevice && maxConnections > 0) {
        const topDev = deviceModule.findDeviceByName(mostConnectedDevice);
        const topDevInfo = `${topDev.name} (${topDev.type}, IP: ${topDev.ip}) with ${maxConnections} connection(s)`;
        console.log("Most Connected Device: " + topDevInfo);
        report += "Most Connected Device: " + topDevInfo + "\n\n";
    } else {
        console.log("Most Connected Device: None (No connections)");
        report += "Most Connected Device: None (No connections)\n\n";
    }

    if (connections.length === 0) {
        console.log("Security Warning: No network connections found.");
    }

    if (invalidConnections > 0) {
        console.log("Security Warning: " + invalidConnections + " invalid connection(s) found.");
        report += "Security Warning: " + invalidConnections + " invalid connection(s) found.\n";
    }

    console.log("\n=================================");
    console.log("        Network Topology        ");
    console.log("=================================");

    for (const deviceName in topology) {
        const currentDevice = deviceModule.findDeviceByName(deviceName);
        const deviceLabel = `${currentDevice.name} (${currentDevice.type}, IP: ${currentDevice.ip})`;

        if (topology[deviceName].length === 0) {
            console.log(deviceLabel + " -> No outgoing connections");
            report += deviceLabel + " -> No outgoing connections\n";
            disconnectedDevices++;
        } else {
            console.log(deviceLabel + " -> " + topology[deviceName].join(", "));
            report += deviceLabel + " -> " + topology[deviceName].join(", ") + "\n";
        }
    }

    if (disconnectedDevices > 0) {
        console.log("Security Warning: " + disconnectedDevices + " device(s) have no connections.");
        report += "Security Warning: " + disconnectedDevices + " device(s) have no connections.";
    }

    console.log("=================================");
    console.log("Topology generated successfully.");

    fs.writeFileSync("data/topology-report.txt", report);
    console.log("Topology report saved successfully.");
}

module.exports = {
    generateTopology
};

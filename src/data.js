const fs = require("fs");

function loadDevices() {
	try {
		const data = fs.readFileSync("data/devices.json", "utf8");
		return JSON.parse(data);
	} catch (error) {
		return [];
	}
}

function loadConnections() {
	try {
		const data = fs.readFileSync("data/connections.json", "utf8");
		return JSON.parse(data);
	} catch (error) {
		return [];
	}
}

function saveDevices(devices) {
	fs.writeFileSync("data/devices.json", JSON.stringify(devices, null, 2));
}

function saveConnections(connections) {
	fs.writeFileSync("data/connections.json", JSON.stringify(connections, null, 2));
}

module.exports = {
	loadDevices,
	loadConnections,
	saveDevices,
	saveConnections
};

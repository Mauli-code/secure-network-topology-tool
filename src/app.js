const readline = require("readline");
const fs = require("fs");

function loadDevices() {
    const data = fs.readFileSync("data/devices.json", "utf8");
    const devices = JSON.parse(data);
    return devices;
}

function loadConnections() {
    try {
        const data = fs.readFileSync("data/connections.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function showMenu() {
    console.log("=================================");
    console.log(" Secure Network Topology Tool");
    console.log("=================================");
    console.log("1. About");
    console.log("2. List Devices");
    console.log("3. Add Device");
    console.log("4. Add Connection");
    console.log("5. Generate Topology");
    console.log("6. Exit");

    rl.question("Enter your choice: ", function(choice) {
        processChoice(choice);
    });
}

function isValidIP(ip) {
    const parts = ip.split(".");
    if (parts.length !== 4) {
        return false;
    }
    let valid = true;
    parts.forEach(function(part) {
        const number = Number(part);
        if (part === "" || Number.isNaN(number) || number < 0 || number > 255) {
            valid = false;
        }
    });
    return valid;
}

function isValidName(name) {
    return name.trim() !== "";
}

function isValidType(type) {
    const allowedTypes = ["router", "switch", "pc"];
    const enteredType = type.trim().toLowerCase();

    for (const allowedType of allowedTypes) {
        if (enteredType === allowedType) {
            return true;
        }
    }

    return false;
}

function findDeviceByName(name) {
    const devices = loadDevices();
    for (const device of devices) {
        if (device.name.toLowerCase() === name.toLowerCase()) {
            return device;
        }
    }
    return null;
}

/* Generate Network Topology */
function generateTopology() {
    const devices = loadDevices();
    const connections = loadConnections();

    let report = "Network Topology Report\n";
    report += "=======================\n\n";
    report += "Devices: " + devices.length + "\n";
    report += "Connections: " + connections.length + "\n\n";

    console.log("\nTopology Summary");
    console.log("----------------");
    console.log("Devices: " + devices.length);
    console.log("Connections: " + connections.length);

    if (connections.length === 0) {
        console.log("Security Warning: No network connections found.");
    }

    const topology = {};
    let invalidConnections = 0;
    let disconnectedDevices = 0;

    devices.forEach(function(device) {
        topology[device.name] = [];
    });

    connections.forEach(function(connection) {
        const sourceDevice = findDeviceByName(connection.source);
        const destinationDevice = findDeviceByName(connection.destination);

        if (sourceDevice === null || destinationDevice === null) {
            invalidConnections++;
            console.log(
                "Security Warning: Connection contains an unknown device."
            );
            return;
        }

        topology[sourceDevice.name].push(destinationDevice.name);
        topology[destinationDevice.name].push(sourceDevice.name);
    });

    if (invalidConnections > 0) {
        console.log("Security Warning: " + invalidConnections + " invalid connection(s) found.");
        report += "Security Warning: " + invalidConnections + " invalid connection(s) found.\n";
    }

    console.log("\n========== Network Topology ==========");

    for (const deviceName in topology) {
        if (topology[deviceName].length === 0) {
            console.log(deviceName + " -> No outgoing connections");
            report += deviceName + " -> No outgoing connections\n";
            disconnectedDevices++;
        } else {
            console.log(deviceName + " -> " + topology[deviceName].join(", "));
            report += deviceName + " -> " + topology[deviceName].join(", ") + "\n";
        }
    }

    if (disconnectedDevices > 0) {
        console.log("Security Warning: " + disconnectedDevices + " device(s) have no connections.");
        report += "Security Warning: " + disconnectedDevices + " device(s) have no connections.";
    }

    console.log("======================================");
    console.log("Topology generated successfully.");

    fs.writeFileSync("data/topology-report.txt", report);
    console.log("Topology report saved successfully.");
}

function processChoice(choice) {
    if (choice === "1") {
        console.log("Secure Network Topology Tool v1.0");
        showMenu();

    } else if (choice === "2") {
        const devices = loadDevices();
        if (devices.length === 0) {
            console.log("No devices found.");
        } else {
            devices.forEach(function(device) {
                console.log(device);
            });
        }
        showMenu();

    } else if (choice === "3") {
        const devices = loadDevices();

        rl.question("Enter device name: ", function(name) {
            if (!isValidName(name)) {
                console.log("Invalid device name.");
                showMenu();
                return;
            }

            let duplicateName = false;
            devices.forEach(function(device) {
                if (device.name.toLowerCase() === name.toLowerCase()) {
                    duplicateName = true;
                }
            });

            if (duplicateName) {
                console.log("Security Warning: Duplicate device name detected.");
            }

            rl.question("Enter device type: ", function(type) {
                if (!isValidType(type)) {
                    console.log("Invalid device type.");
                    console.log("Allowed types: Router, Switch, PC");
                    showMenu();
                    return;
                }

                if (type.trim().toLowerCase() === "router") {
                    type = "Router";
                } else if (type.trim().toLowerCase() === "switch") {
                    type = "Switch";
                } else if (type.trim().toLowerCase() === "pc") {
                    type = "PC";
                }

                rl.question("Enter IP address: ", function(ip) {
                    if (!isValidIP(ip)) {
                        console.log("Invalid IP address.");
                        showMenu();
                        return;
                    }
                    let duplicateFound = false;

                    devices.forEach(function(device) {
                        if (device.ip === ip) {
                            console.log("Security Warning: Duplicate IP address detected.");
                            console.log(ip + " is already assigned to " + device.name + ".");
                            console.log("Please review the network configuration.");
                            duplicateFound = true;
                        }
                    });
                    const id = devices.length + 1;
                    const device = {
                        id: id,
                        name: name,
                        type: type,
                        ip: ip
                    };
                    devices.push(device);

                    const jsonData = JSON.stringify(devices, null, 2);
                    fs.writeFileSync("data/devices.json", jsonData);

                    console.log(device);
                    showMenu();
                });
            });
        });

    } else if (choice === "4") {
        rl.question("Enter source device: ", function(source) {
            rl.question("Enter destination device: ", function(destination) {
                const sourceDevice = findDeviceByName(source);
                const destinationDevice = findDeviceByName(destination);

                if (!sourceDevice || !destinationDevice) {
                    console.log("Error: Source or destination device does not exist.");
                    showMenu();
                    return;
                }

                if (sourceDevice.name.toLowerCase() === destinationDevice.name.toLowerCase()) {
                    console.log("Error: Cannot connect a device to itself.");
                    showMenu();
                    return;
                }

                const connections = loadConnections();

                let duplicateConnection = false;
                connections.forEach(function(existingConnection) {
                    const existingSrc = existingConnection.source.toLowerCase();
                    const existingDst = existingConnection.destination.toLowerCase();
                    const currentSrc = sourceDevice.name.toLowerCase();
                    const currentDst = destinationDevice.name.toLowerCase();

                    if (
                        (existingSrc === currentSrc && existingDst === currentDst) ||
                        (existingSrc === currentDst && existingDst === currentSrc)
                    ) {
                        duplicateConnection = true;
                    }
                });

                if (duplicateConnection) {
                    console.log("Warning: This connection already exists.");
                    showMenu();
                    return;
                }
                const connection = {
                    source: sourceDevice.name,
                    destination: destinationDevice.name
                };
                connections.push(connection);

                const jsonData = JSON.stringify(connections, null, 2);
                fs.writeFileSync("data/connections.json", jsonData);

                console.log(connection);
                showMenu();
            });
        });

    } else if (choice === "5") {
        generateTopology();
        showMenu();

    } else if (choice === "6") {
        console.log("Exiting...");
        rl.close();

    } else {
        console.log("Invalid choice. Please try again.");
        showMenu();
    }
}

// Start the menu when the app is run
showMenu();
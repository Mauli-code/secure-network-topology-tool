const readline = require("readline");
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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function showMenu() {
    console.log("=================================");
    console.log(" Secure Network Topology Tool");
    console.log("=================================");
    console.log("1. About");
    console.log("2. List Devices");
    console.log("3. Add Device");
    console.log("4. Remove Device");
    console.log("5. Add Connection");
    console.log("6. List Connections");
    console.log("7. Generate Topology");
    console.log("8. Search Device by Name");
    console.log("9. Search Device by IP");
    console.log("10. Exit");
    console.log("11. Check Device Connectivity");

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

        topology[sourceDevice.name].push(`${destinationDevice.name} (${destinationDevice.type}, IP: ${destinationDevice.ip})`);
        topology[destinationDevice.name].push(`${sourceDevice.name} (${sourceDevice.type}, IP: ${sourceDevice.ip})`);
    });

    // Find Most Connected Device
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
        const topDev = findDeviceByName(mostConnectedDevice);
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
        const currentDevice = findDeviceByName(deviceName);
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

/* Phase 16: Check Connectivity Function */
function checkConnectivity() {
    const devices = loadDevices();
    const connections = loadConnections();

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

function processChoice(choice) {
    if (choice === "1") {
        console.log("Secure Network Topology Tool v1.0");
        showMenu();

    } else if (choice === "2") {
        const devices = loadDevices();
        if (devices.length === 0) {
            console.log("No devices found.");
        } else {
            console.log("=================================");
            console.log("         List of Devices         ");
            console.log("=================================");
            devices.forEach(function(device) {
                console.log(`ID: ${device.id} | Name: ${device.name} | Type: ${device.type} | IP: ${device.ip}`);
            });
            console.log("=================================");
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

                    let id = 1;
                    devices.forEach(function(device) {
                        if (device.id >= id) {
                            id = device.id + 1;
                        }
                    });

                    const device = {
                        id: id,
                        name: name,
                        type: type,
                        ip: ip
                    };
                    devices.push(device);

                    const jsonData = JSON.stringify(devices, null, 2);
                    fs.writeFileSync("data/devices.json", jsonData);

                    console.log(`Device added successfully: ID: ${device.id} | Name: ${device.name} | Type: ${device.type} | IP: ${device.ip}`);
                    showMenu();
                });
            });
        });

    } else if (choice === "4") {
        rl.question("Enter device name to remove: ", function(name) {
            const deviceToRemove = findDeviceByName(name);

            if (!deviceToRemove) {
                console.log("Error: Device does not exist.");
                showMenu();
                return;
            }

            let devices = loadDevices();
            devices = devices.filter(function(device) {
                return device.name.toLowerCase() !== name.toLowerCase();
            });
            fs.writeFileSync("data/devices.json", JSON.stringify(devices, null, 2));

            let connections = loadConnections();
            connections = connections.filter(function(connection) {
                const srcMatch = connection.source.toLowerCase() === name.toLowerCase();
                const dstMatch = connection.destination.toLowerCase() === name.toLowerCase();
                return !srcMatch && !dstMatch;
            });
            fs.writeFileSync("data/connections.json", JSON.stringify(connections, null, 2));

            console.log("Device and related connections removed successfully.");
            showMenu();
        });

    } else if (choice === "5") {
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

                console.log(`Connection created: ${connection.source} -> ${connection.destination}`);
                showMenu();
            });
        });

    } else if (choice === "6") {
        const connections = loadConnections();
        if (connections.length === 0) {
            console.log("No connections found.");
        } else {
            console.log("=================================");
            console.log("       Network Connections       ");
            console.log("=================================");
            connections.forEach(function(connection) {
                console.log(connection.source + " -> " + connection.destination);
            });
            console.log("=================================");
        }
        showMenu();

    } else if (choice === "7") {
        generateTopology();
        showMenu();

    } else if (choice === "8") {
        rl.question("Enter device name to search: ", function(name) {
            const device = findDeviceByName(name);

            if (!device) {
                console.log("Error: Device not found.");
            } else {
                console.log("\n========== Device Found ==========");
                console.log("ID: " + device.id);
                console.log("Name: " + device.name);
                console.log("Type: " + device.type);
                console.log("IP: " + device.ip);
                console.log("==================================");
            }
            showMenu();
        });

    } else if (choice === "9") {
        rl.question("Enter IP address to search: ", function(ip) {
            const devices = loadDevices();
            const foundDevices = [];

            devices.forEach(function(device) {
                if (device.ip === ip) {
                    foundDevices.push(device);
                }
            });

            if (foundDevices.length === 0) {
                console.log("Device not found.");
                showMenu();
                return;
            }

            console.log("\n========== Devices Found ==========");
            foundDevices.forEach(function(device) {
                console.log("ID: " + device.id);
                console.log("Name: " + device.name);
                console.log("Type: " + device.type);
                console.log("IP: " + device.ip);
                console.log("----------------");
            });

            if (foundDevices.length > 1) {
                console.log("Security Warning: Multiple devices are using this IP address.");
            }
            console.log("===================================");
            showMenu();
        });

    } else if (choice === "10") {
        console.log("Exiting...");
        rl.close();

    } else if (choice === "11") {
        checkConnectivity();
        showMenu();

    } else {
        console.log("Invalid choice. Please try again.");
        showMenu();
    }
}

// Start the menu when the app is run
showMenu();
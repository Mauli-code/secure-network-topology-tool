const readline = require("readline");
const data = require("./data");
const validation = require("./validation");
const deviceModule = require("./device");
const connectionModule = require("./connection");
const topologyModule = require("./topology");
const searchModule = require("./search");
const connectivityModule = require("./connectivity");

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

function processChoice(choice) {
    if (choice === "1") {
        console.log("Secure Network Topology Tool v1.0");
        showMenu();

    } else if (choice === "2") {
        const devices = data.loadDevices();
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
        const devices = data.loadDevices();

        rl.question("Enter device name: ", function(name) {
            const trimmedName = name.trim();
            if (!validation.isValidName(trimmedName)) {
                console.log("Invalid device name.");
                showMenu();
                return;
            }

            let duplicateName = false;
            devices.forEach(function(device) {
                if (device.name.toLowerCase() === trimmedName.toLowerCase()) {
                    duplicateName = true;
                }
            });

            if (duplicateName) {
                console.log("Security Warning: Duplicate device name detected.");
            }

            rl.question("Enter device type: ", function(type) {
                if (!validation.isValidType(type)) {
                    console.log("Invalid device type.");
                    console.log("Allowed types: Router, Switch, PC");
                    showMenu();
                    return;
                }

                const formattedType = validation.formatDeviceType(type);

                rl.question("Enter IP address: ", function(ip) {
                    const trimmedIP = ip.trim();
                    if (!validation.isValidIP(trimmedIP)) {
                        console.log("Invalid IP address.");
                        showMenu();
                        return;
                    }
                    let duplicateFound = false;

                    devices.forEach(function(device) {
                        if (device.ip === trimmedIP) {
                            console.log("Security Warning: Duplicate IP address detected.");
                            console.log(trimmedIP + " is already assigned to " + device.name + ".");
                            console.log("Please review the network configuration.");
                            duplicateFound = true;
                        }
                    });

                    const device = {
                        id: deviceModule.getNextDeviceId(devices),
                        name: trimmedName,
                        type: formattedType,
                        ip: trimmedIP
                    };
                    deviceModule.addDevice(device);

                    console.log(`Device added successfully: ID: ${device.id} | Name: ${device.name} | Type: ${device.type} | IP: ${device.ip}`);
                    showMenu();
                });
            });
        });

    } else if (choice === "4") {
        rl.question("Enter device name to remove: ", function(name) {
            const deviceToRemove = deviceModule.findDeviceByName(name);

            if (!deviceToRemove) {
                console.log("Error: Device does not exist.");
                showMenu();
                return;
            }

            deviceModule.removeDevice(name);

            connectionModule.removeConnectionsForDevice(name);

            console.log("Device and related connections removed successfully.");
            showMenu();
        });

    } else if (choice === "5") {
        rl.question("Enter source device: ", function(source) {
            rl.question("Enter destination device: ", function(destination) {
                const sourceDevice = deviceModule.findDeviceByName(source);
                const destinationDevice = deviceModule.findDeviceByName(destination);

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

                if (connectionModule.connectionExists(sourceDevice.name, destinationDevice.name)) {
                    console.log("Warning: This connection already exists.");
                    showMenu();
                    return;
                }
                connectionModule.addConnection(sourceDevice.name, destinationDevice.name);

                console.log(`Connection created: ${sourceDevice.name} -> ${destinationDevice.name}`);
                showMenu();
            });
        });

    } else if (choice === "6") {
        const connections = connectionModule.getConnections();
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
        topologyModule.generateTopology();
        showMenu();

    } else if (choice === "8") {
        rl.question("Enter device name to search: ", function(name) {
            const device = searchModule.searchByName(name);

            if (!device) {
                console.log("Error: Device not found.");
            } else {
                console.log("\n========== Device Found ==========");
                searchModule.displayDevice(device);
                console.log("==================================");
            }
            showMenu();
        });

    } else if (choice === "9") {
        rl.question("Enter IP address to search: ", function(ip) {
            const foundDevices = searchModule.searchByIP(ip);

            if (foundDevices.length === 0) {
                console.log("Device not found.");
                showMenu();
                return;
            }

            console.log("\n========== Devices Found ==========");
            foundDevices.forEach(function(device) {
                searchModule.displayDevice(device);
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
        connectivityModule.checkConnectivity();
        showMenu();

    } else {
        console.log("Invalid choice. Please try again.");
        showMenu();
    }
}

// Start the menu when the app is run
showMenu();
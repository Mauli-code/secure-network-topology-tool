const readline = require("readline");
const data = require("./data");
const validation = require("./validation");
const deviceModule = require("./device");
const connectionModule = require("./connection");
const topologyModule = require("./topology");
const searchModule = require("./search");
const connectivityModule = require("./connectivity");

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function showMenu() {
    console.log(BLUE + "=================================" + RESET);
    console.log(BLUE + " Secure Network Topology Tool" + RESET);
    console.log(BLUE + "=================================" + RESET);
    console.log("1. About");
    console.log("2. List Devices");
    console.log("3. Add Device");
    console.log("4. Remove Device");
    console.log("5. Add Connection");
    console.log("6. List Connections");
    console.log("7. Generate Topology");
    console.log("8. Search Device by Name");
    console.log("9. Search Device by IP");
    console.log("10. Check Device Connectivity");
    console.log(RED + "11. Exit");

    rl.question(BLUE + "Enter your choice: " + RESET, function(choice) {
        processChoice(choice);
    });
}

function processChoice(choice) {
    if (choice === "1") {
        console.log(BLUE + "Secure Network Topology Tool v1.0" + RESET);
        showMenu();

    } else if (choice === "2") {
        const devices = data.loadDevices();
        if (devices.length === 0) {
            console.log(YELLOW + "No devices found." + RESET);
        } else {
            console.log(BLUE + "=================================" + RESET);
            console.log(BLUE + "         List of Devices         " + RESET);
            console.log(BLUE + "=================================" + RESET);
            devices.forEach(function(device) {
                console.log(`ID: ${device.id} | Name: ${device.name} | Type: ${device.type} | IP: ${device.ip}`);
            });
            console.log(BLUE + "=================================" + RESET);
        }
        showMenu();

    } else if (choice === "3") {
        const devices = data.loadDevices();

        rl.question("Enter device name: ", function(name) {
            const trimmedName = name.trim();
            if (!validation.isValidName(trimmedName)) {
                console.log(RED + "Invalid device name." + RESET);
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
                console.log(RED + "Error: Duplicate device name detected. Device was not added." + RESET);
                showMenu();
                return;
            }

            rl.question("Enter device type: ", function(type) {
                if (!validation.isValidType(type)) {
                    console.log(RED + "Invalid device type." + RESET);
                    console.log(YELLOW + "Allowed types: Router, Switch, PC" + RESET);
                    showMenu();
                    return;
                }

                const formattedType = validation.formatDeviceType(type);

                rl.question("Enter IP address: ", function(ip) {
                    const trimmedIP = ip.trim();
                    if (!validation.isValidIP(trimmedIP)) {
                        console.log(RED + "Invalid IP address." + RESET);
                        showMenu();
                        return;
                    }
                    let duplicateFound = false;

                    devices.forEach(function(device) {
                        if (device.ip === trimmedIP) {
                            duplicateFound = true;
                        }
                    });

                    if (duplicateFound) {
                        console.log(RED + "Error: Duplicate IP address detected. Device was not added." + RESET);
                        showMenu();
                        return;
                    }

                    const device = {
                        id: deviceModule.getNextDeviceId(devices),
                        name: trimmedName,
                        type: formattedType,
                        ip: trimmedIP
                    };
                    deviceModule.addDevice(device);

                    console.log(GREEN + `Device added successfully: ID: ${device.id} | Name: ${device.name} | Type: ${device.type} | IP: ${device.ip}` + RESET);
                    showMenu();
                });
            });
        });

    } else if (choice === "4") {
        rl.question("Enter device name to remove: ", function(name) {
            const deviceToRemove = deviceModule.findDeviceByName(name);

            if (!deviceToRemove) {
                console.log(RED + "Error: Device does not exist." + RESET);
                showMenu();
                return;
            }

            deviceModule.removeDevice(name);

            connectionModule.removeConnectionsForDevice(name);

            console.log(GREEN + "Device and related connections removed successfully." + RESET);
            showMenu();
        });

    } else if (choice === "5") {
        rl.question("Enter source device: ", function(source) {
            rl.question("Enter destination device: ", function(destination) {
                const sourceDevice = deviceModule.findDeviceByName(source);
                const destinationDevice = deviceModule.findDeviceByName(destination);

                if (!sourceDevice || !destinationDevice) {
                    console.log(RED + "Error: Source or destination device does not exist." + RESET);
                    showMenu();
                    return;
                }

                if (sourceDevice.name.toLowerCase() === destinationDevice.name.toLowerCase()) {
                    console.log(RED + "Error: Cannot connect a device to itself." + RESET);
                    showMenu();
                    return;
                }

                if (connectionModule.connectionExists(sourceDevice.name, destinationDevice.name)) {
                    console.log(YELLOW + "Warning: This connection already exists." + RESET);
                    showMenu();
                    return;
                }
                connectionModule.addConnection(sourceDevice.name, destinationDevice.name);

                console.log(GREEN + `Connection created: ${sourceDevice.name} -> ${destinationDevice.name}` + RESET);
                showMenu();
            });
        });

    } else if (choice === "6") {
        const connections = connectionModule.getConnections();
        if (connections.length === 0) {
            console.log(YELLOW + "No connections found." + RESET);
        } else {
            console.log(BLUE + "=================================" + RESET);
            console.log(BLUE + "       Network Connections       " + RESET);
            console.log(BLUE + "=================================" + RESET);
            connections.forEach(function(connection) {
                console.log(connection.source + " -> " + connection.destination);
            });
            console.log(BLUE + "=================================" + RESET);
        }
        showMenu();

    } else if (choice === "7") {
        topologyModule.generateTopology();
        showMenu();

    } else if (choice === "8") {
        rl.question("Enter device name to search: ", function(name) {
            const device = searchModule.searchByName(name);

            if (!device) {
                console.log(RED + "Error: Device not found." + RESET);
            } else {
                console.log(BLUE + "\n========== Device Found ==========" + RESET);
                searchModule.displayDevice(device);
                console.log(BLUE + "==================================" + RESET);
            }
            showMenu();
        });

    } else if (choice === "9") {
        rl.question("Enter IP address to search: ", function(ip) {
            const foundDevices = searchModule.searchByIP(ip);

            if (foundDevices.length === 0) {
                console.log(RED + "Device not found." + RESET);
                showMenu();
                return;
            }

            console.log(BLUE + "\n========== Devices Found ==========" + RESET);
            foundDevices.forEach(function(device) {
                searchModule.displayDevice(device);
                console.log("----------------");
            });

            if (foundDevices.length > 1) {
                console.log(YELLOW + "Security Warning: Multiple devices are using this IP address." + RESET);
            }
            console.log(BLUE + "===================================" + RESET);
            showMenu();
        });

    } else if (choice === "10") {
        connectivityModule.checkConnectivity();
        showMenu();

    } else if (choice === "11") {
        console.log(RED + "Exiting..." + RESET);
        rl.close();

    } else {
        console.log(RED + "Invalid choice. Please try again." + RESET);
        showMenu();
    }
}

// Start the menu when the app is run
showMenu();
const readline = require("readline"); 
const fs = require("fs");

function loadDevices() {
    const data = fs.readFileSync("data/devices.json", "utf8");
    const devices = JSON.parse(data);

    return devices;
}

const fs = require("fs");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 

function showMenu() { 
    console.log("\n================================="); 
    console.log(" Secure Network Topology Tool"); 
    console.log("================================="); 
    console.log("1. About");
    console.log("2. List Devices");
    console.log("3. Add Device");
    console.log("4. Exit");
  rl.question("Enter your choice: ", function(choice) { 
    // Pass the user input into the dedicated function from the diagram
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

        rl.question("Enter device type: ", function(type) {

            rl.question("Enter IP address: ", function(ip) {
                
                if (!isValidIP(ip)) {
                    console.log("Invalid IP address.");
                    showMenu();
                    return;
                }

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
    console.log("Exiting...");
    rl.close();
  } else {
    console.log("Invalid choice. Please try again.");
    showMenu();
  }
}

// Start the menu when the app is run
showMenu();

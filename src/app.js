const readline = require("readline"); 
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
    console.log("3. Exit");
  rl.question("Enter your choice: ", function(choice) { 
    // Pass the user input into the dedicated function from the diagram
    processChoice(choice); 
  }); 
} 

// Dedicated function handling the logic flows
function processChoice(choice) {
  if (choice === "1") {
    console.log("Secure Network Topology Tool v1.0");
    showMenu();
  } else if (choice === "2") {
  const devices = loadDevices();
  if (devices.length === 0) {
    console.log("No devices found.");
    showMenu();
  }}else if (choice === "3") {
    console.log("Exiting...");
    rl.close();
  } else {
    console.log("Invalid choice. Please try again.");
    showMenu();
  }
  }
showMenu();

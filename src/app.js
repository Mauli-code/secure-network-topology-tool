const readline = require("readline"); 
const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 

function showMenu() { 
  console.log("\n================================="); 
  console.log(" Secure Network Topology Tool"); 
  console.log("================================="); 
  console.log("1. About"); 
  console.log("2. Exit"); 
  
  rl.question("Enter your choice: ", function(choice) { 
    // Pass the user input into the dedicated function from the diagram
    processChoice(choice); 
  }); 
} 

// Dedicated function handling the logic flows
function processChoice(choice) {
  if (choice === "1") { 
    console.log("\nThis tool creates and checks network topologies."); 
    showMenu(); 
  } else if (choice === "2") { 
    console.log("\nExiting application..."); 
    rl.close(); 
  } else { 
    console.log("\nInvalid choice. Please try again."); 
    showMenu(); 
  } 
}

showMenu();

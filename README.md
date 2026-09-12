# Secure Automatic Network Topology Creation Tool

## Project Description

The Secure Automatic Network Topology Creation Tool is a basic Node.js command-line application that allows users to manage network devices and connections and generate a network topology.

The application stores device and connection information in JSON files. It can validate device information, detect configuration problems such as duplicate IP addresses, generate a topology, check network connectivity, and create network health and topology reports.

The project is designed to demonstrate basic application development concepts using Node.js and JavaScript.

## Features

* Add, list, search, and remove network devices.
* Add and list network connections.
* Automatically generate a network topology.
* Validate device names, types, and IP addresses.
* Detect duplicate IP addresses and other configuration problems.
* Prevent self-connections and duplicate connections.
* Check network connectivity and identify disconnected devices.
* Show network statistics.
* Show network health status.
* Generate and save topology and network health reports.

## How to Run

1. Make sure Node.js is installed on your computer.
2. Open the project folder in the terminal.
3. Run the following command:

```bash
npm start
```

4. The application will open in the terminal.
5. Select an option from the menu and follow the instructions shown by the application.

## Project Structure

```text
secure-network-topology-tool/
├── src/
│   └── app.js
├── data/
│   ├── devices.json
│   ├── connections.json
│   ├── topology-report.txt
│   └── health-report.txt
├── README.md
├── package.json
└── .gitignore
```

### Main Files

* `src/app.js` — Contains the main application logic and CLI menu.
* `data/devices.json` — Stores network device information.
* `data/connections.json` — Stores connections between devices.
* `data/topology-report.txt` — Stores the generated network topology report.
* `data/health-report.txt` — Stores the network health report.
* `package.json` — Contains the project information and start script.
* `.gitignore` — Specifies files that Git should ignore.

## Security and Validation Checks

The application performs several basic checks to help identify network configuration problems:

* Checks whether an IP address is valid.
* Warns when multiple devices use the same IP address.
* Validates device names and device types.
* Warns about duplicate device names.
* Prevents a device from being connected to itself.
* Prevents duplicate connections.
* Detects connections that refer to unknown devices.
* Identifies devices that have no connections.
* Shows a warning when the network has disconnected devices.


## Project Status

The project is currently functional and can:

* Manage network devices and connections.
* Generate a network topology.
* Perform basic security and validation checks.
* Check network connectivity.
* Calculate network statistics.
* Determine network health.
* Save topology and health reports.

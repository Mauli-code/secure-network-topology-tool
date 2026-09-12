# Secure Automatic Network Topology Creation Tool

## Project Description

The **Secure Automatic Network Topology Creation Tool** is a Node.js command-line application for managing network devices and connections and generating a network topology.

The application allows users to add, remove, search, and manage network devices and connections. Device and connection information is stored in JSON files.

The project also performs basic validation and security checks, generates a topology, and checks whether devices have recorded network connections.

This project is developed as a Semester 3 Application Development project using basic Node.js and JavaScript concepts.

## Features

* Add network devices
* List network devices
* Remove network devices
* Search devices by name
* Search devices by IP address
* Add network connections
* List network connections
* Prevent devices from connecting to themselves
* Prevent duplicate connections
* Validate device names, types, and IP addresses
* Detect duplicate device names and IP addresses
* Generate a network topology
* Identify devices with no recorded connections
* Check device connectivity based on recorded connections
* Generate and save a topology report
* Use simple terminal colours for better CLI readability

## Technologies Used

* Node.js
* JavaScript
* `readline`
* `fs`
* JSON
* Git and GitHub

No external npm packages are required for the main application.

## How the Application Works

The application starts with a command-line menu.

The user selects an option from the menu, such as adding a device, adding a connection, searching for a device, or generating the topology.

Device information is stored in:

```text
data/devices.json
```

Connection information is stored in:

```text
data/connections.json
```

When the topology is generated, the application reads the device and connection information and creates a representation of the network.

A topology report is saved as:

```text
data/topology-report.txt
```

## Main Menu

The application currently provides options for:

```text
1. About
2. List Devices
3. Add Device
4. Remove Device
5. Add Connection
6. List Connections
7. Generate Topology
8. Search Device by Name
9. Search Device by IP
10. Check Device Connectivity
11. Exit
```

## Project Structure

```text
secure-network-topology-tool/
│
├── data/
│   ├── devices.json
│   ├── connections.json
│   └── topology-report.txt
│
├── src/
│   ├── app.js
│   ├── connection.js
│   ├── connectivity.js
│   ├── data.js
│   ├── device.js
│   ├── search.js
│   ├── topology.js
│   └── validation.js
│
├── .gitignore
├── package.json
└── README.md
```

## Main Files

### `src/app.js`

Contains the main CLI application, menu, user input, and application flow.

### `src/device.js`

Handles device-related operations such as finding, adding, and removing devices.

### `src/connection.js`

Handles network connections between devices, including adding connections, checking duplicate connections, and removing connections related to a device.

### `src/connectivity.js`

Checks whether each device has a recorded connection and identifies devices without connections.

### `src/data.js`

Handles reading and writing device and connection data using JSON files.

### `src/search.js`

Provides device search functionality by name and IP address.

### `src/topology.js`

Generates the network topology using the stored devices and connections and creates the topology report.

### `src/validation.js`

Validates device names, device types, and IP addresses.

## Data Storage

The project uses JSON files instead of a database.

### `devices.json`

Stores information about network devices.


## Basic Security and Validation

The application performs basic checks to reduce configuration errors.

These include:

* Validating IPv4 addresses
* Validating device names
* Validating device types
* Checking duplicate device names
* Checking duplicate IP addresses
* Preventing self-connections
* Preventing duplicate connections
* Checking whether connected devices exist
* Identifying devices with no recorded connections

These are basic application-level security and validation checks. The current project does not perform real network discovery or live SCADA network monitoring.

## Topology Generation

The topology is generated from the devices and connections stored in the JSON files.

For example:

```text
Router-01
   |
   └── Switch-01
          |
          ├── PC-01
          └── PC-02
```

The application also identifies devices with no outgoing connections and reports the most connected device.
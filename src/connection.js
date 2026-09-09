const data = require("./data");

function getConnections() {
    return data.loadConnections();
}

function connectionExists(source, destination) {
    const connections = data.loadConnections();
    const currentSource = source.toLowerCase();
    const currentDestination = destination.toLowerCase();

    return connections.some(function(connection) {
        const existingSource = connection.source.toLowerCase();
        const existingDestination = connection.destination.toLowerCase();
        return (
            (existingSource === currentSource && existingDestination === currentDestination) ||
            (existingSource === currentDestination && existingDestination === currentSource)
        );
    });
}

function addConnection(source, destination) {
    const connections = data.loadConnections();
    connections.push({
        source,
        destination
    });
    data.saveConnections(connections);
}

function removeConnectionsForDevice(name) {
    const connections = data.loadConnections();
    const normalizedName = name.trim().toLowerCase();
    const remainingConnections = connections.filter(function(connection) {
        const sourceMatches = connection.source.toLowerCase() === normalizedName;
        const destinationMatches = connection.destination.toLowerCase() === normalizedName;
        return !sourceMatches && !destinationMatches;
    });

    data.saveConnections(remainingConnections);
}

module.exports = {
    getConnections,
    connectionExists,
    addConnection,
    removeConnectionsForDevice
};

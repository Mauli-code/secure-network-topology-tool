function isValidIP(ip) {
	const parts = ip.trim().split(".");
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

function formatDeviceType(type) {
	const formattedType = type.trim().toLowerCase();
	if (formattedType === "router") {
		return "Router";
	}
	if (formattedType === "switch") {
		return "Switch";
	}
	return "PC";
}

module.exports = {
	isValidIP,
	isValidName,
	isValidType,
	formatDeviceType
};

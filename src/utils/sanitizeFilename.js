export function sanitizeFilename(name) {
	return name
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9_.-]/g, "_");
}
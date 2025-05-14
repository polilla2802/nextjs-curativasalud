// Custom replacer to convert BigInt to Number
export const bigIntToString = (key, value) => {
	if (typeof value === 'bigint') {
		return value.toString(); // Convert BigInt to string
	}
	return value;
};
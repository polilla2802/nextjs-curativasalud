export const getCurrentDate = () => {
	const currentDate = new Date();
	const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

	return formattedDate;
};
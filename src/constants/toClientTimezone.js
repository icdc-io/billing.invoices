export const isInvalidDate = (date) => Number.isNaN(Date.parse(date));

export const withClientTimezone = (date) => {
	return isInvalidDate(date)
		? ""
		: new Date(date).toLocaleString("en-US", { hour12: false });
};

export const isInvalidDate = (date) => isNaN(Date.parse(date));

export const formatDateForRequest = (date) => {
  return date ? date.toISOString().split(".")[0].split("T").join(" ") : "";
};

export const withClientTimezone = (date) => {
  return isInvalidDate(date) ? "" :
    new Date(date)
    .toLocaleString("en-US", { hour12: false });
};

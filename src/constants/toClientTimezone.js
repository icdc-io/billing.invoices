const MILISECS_IN_MIN = 60 * 1000;

export const isInvalidDate = (date) => isNaN(Date.parse(date));

export const formatDateForRequest = (date) => {
  return date ? date.toISOString().split(".")[0].split("T").join(" ") : "";
};

export const withClientTimezone = (date) => {
  return isInvalidDate(date) ? "" :
    new Date(Number(new Date(date)) - ((new Date().getTimezoneOffset()) * MILISECS_IN_MIN))
    .toLocaleString("en-US", { hour12: false });
};

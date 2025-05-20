const REACT_APP_API_GATEWAY = process.env.REACT_APP_API_GATEWAY;
const BASE_URL = `${REACT_APP_API_GATEWAY}/api`;

export const INVOICES_FETCH = "INVOICES_FETCH";
export const INVOICES_DATA_URL = `${BASE_URL}/accounts/v1/service_provider/invoices`;
export const invoicesFetchUrl = (filterQuery) =>
	`${BASE_URL}/accounts/v1/service_provider/invoices${filterQuery}`;
export const INVOICE_PUT = "INVOICE_PUT";
export const invoicePutUrl = (invoiceId) =>
	`${BASE_URL}/accounts/v1/service_provider/invoices/${invoiceId}`;
export const INVOICES_ITEM_FETCH_URL_PDF = (invoiceId) =>
	`${BASE_URL}/accounts/v1/share/invoices/${invoiceId}`;

export const notificationMessages = {
	en: {
		sucEditNotif: "Changes saved",
		errNotif: "An error has occurred ",
	},
	ru: {
		sucEditNotif: "Изменения сохранены",
		errNotif: "Произошла ошибка ",
	},
};

const API_GATEWAY = process.env.API_GATEWAY || 'https://api-gw.icdc.d3.zby.icdc.io';
const BASE_URL = `${API_GATEWAY}/api`;

export const INVOICES_FETCH = 'INVOICES_FETCH';
export const INVOICES_DATA_URL = `${BASE_URL}/accounts/v1/service_provider/invoices`;
export const INVOICE_PUT = 'INVOICE_PUT';
export const invoicePutUrl = (invoiceId) => `${BASE_URL}/accounts/v1/service_provider/invoices/${invoiceId}`;
export const INVOICES_ITEM_FETCH_URL_PDF = (invoiceId) => `${BASE_URL}/accounts/v1/share/invoices/${invoiceId}`;

export const notificationMessages = {
    en: {
        sucEditNotif: 'Changes saved',
        errNotif: 'An error has occurred '
    },
    ru: {
        sucEditNotif: 'Изменения сохранены',
        errNotif: 'Произошла ошибка '
    }
};

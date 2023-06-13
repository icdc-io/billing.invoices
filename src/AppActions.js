import * as ActionTypes from './AppConstants';
import { fetchData, updateData } from 'container/Api';
import cogoToast from 'cogo-toast';

const notificationOptions = { position: 'top-right' };

const errorNotification = (error) => {
    cogoToast.error(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].errNotif + error, notificationOptions);
};

const successNotification = () =>
    cogoToast.success(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].sucEditNotif, notificationOptions);

export const infoNotification = (msg) =>
    cogoToast.info(msg, notificationOptions);

const fetchInvoicesDataAction = () => ({
    type: ActionTypes.INVOICES_FETCH,
    payload: fetchData(ActionTypes.INVOICES_DATA_URL, 'accounts')
});

export const fetchInvoicesData = () => (dispatch) => {
    dispatch({ type: `${ActionTypes.INVOICES_FETCH}_PENDING` });
    const response = dispatch(fetchInvoicesDataAction());
    response.catch(error => errorNotification(error.response?.statusText));
};

const putInvoiceAction = (invoice) => ({
    type: ActionTypes.INVOICE_PUT,
    payload: updateData(ActionTypes.invoicePutUrl(invoice.id), invoice, 'accounts')
});

export const putInvoice = (invoice) => (dispatch) => {
    dispatch({ type: `${ActionTypes.INVOICE_PUT}_PENDING` });

    const response = dispatch(putInvoiceAction(invoice));
    response.then(() => {
        dispatch(fetchInvoicesData());
        successNotification();
    }, error => errorNotification(error.response?.statusText));
};

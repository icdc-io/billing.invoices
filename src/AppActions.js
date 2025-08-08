import {
	fetchData,
	showErrorNotification,
	showSuccessNotification,
	updateData,
} from "container/Api";
import * as ActionTypes from "./AppConstants";

const fetchInvoicesDataAction = (filterQuery) => ({
	type: ActionTypes.INVOICES_FETCH,
	payload: fetchData(ActionTypes.invoicesFetchUrl(filterQuery)),
});

export const fetchInvoicesData = (filterQuery) => (dispatch) => {
	const response = dispatch(fetchInvoicesDataAction(filterQuery));
	response.catch(showErrorNotification);
};

const putInvoiceAction = (id, payload) => ({
	type: ActionTypes.INVOICE_PUT,
	payload: updateData(ActionTypes.invoicePutUrl(id), payload),
});

export const putInvoice = (invoice, filterQuery) => (dispatch) => {
	dispatch({ type: `${ActionTypes.INVOICE_PUT}_PENDING` });
	const { id, ...rest } = invoice;
	const response = dispatch(putInvoiceAction(id, rest));
	response.then(() => {
		dispatch(fetchInvoicesData(filterQuery));
		showSuccessNotification();
	}, showErrorNotification);
};

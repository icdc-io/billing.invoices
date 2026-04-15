import Immutable from "seamless-immutable";
import * as ActionTypes from "./AppConstants";
import { withClientTimezone } from "./constants/toClientTimezone";

const initialState = Immutable({
	invoices: [],
	invoicesTotalCount: 0,
	invoicesFetchStatus: "pending",
	invoicesPutStatus: "",
});

export const InvoicesStore = (state = initialState, action) => {
	switch (action.type) {
		case `${ActionTypes.INVOICES_FETCH}_PENDING`:
			return state.set("invoicesFetchStatus", "pending");
		case `${ActionTypes.INVOICES_FETCH}_FULFILLED`:
			return Immutable.merge(state, {
				invoices: action.payload.data.map((invoice) => ({
					...invoice,
					payment_date: withClientTimezone(invoice.payment_date),
				})),
				invoicesTotalCount: action.payload.total,
				invoicesFetchStatus: "fulfilled",
			});
		case `${ActionTypes.INVOICES_FETCH}_REJECTED`:
			return state.set("invoicesFetchStatus", "rejected");

		case `${ActionTypes.INVOICE_PUT}_PENDING`:
			return state.set("invoicesPutStatus", "pending");

		case `${ActionTypes.INVOICE_PUT}_REJECTED`:
			return state.set("invoicesPutStatus", "rejected");

		case `${ActionTypes.INVOICE_PUT}_FULFILLED`:
			return state.set("invoicesPutStatus", "fulfilled");
		default:
			return state;
	}
};

/* eslint camelcase: 0 */
import * as ActionTypes from './AppConstants';
import Immutable from 'seamless-immutable';
import { withClientTimezone } from './constants/toClientTimezone';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    invoices: [],
    invoicesFetchStatus: 'pending',
    invoicesPutStatus: '',
});

export const InvoicesStore = (state = initialState, action) => {
    switch (action.type) {
        case `${ActionTypes.INVOICES_FETCH}_PENDING`:
            return state.set('invoicesFetchStatus', 'pending');
        case `${ActionTypes.INVOICES_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                invoices: action.payload.map((invoice) => ({
                    ...invoice,
                    payment_date: withClientTimezone(invoice.payment_date)
                })),
                invoicesFetchStatus: 'fulfilled'
            });
        case `${ActionTypes.INVOICES_FETCH}_REJECTED`:
            return state.set('invoicesFetchStatus', 'rejected');

        case `${ActionTypes.INVOICE_PUT}_PENDING`:
            return state.set('invoicesPutStatus', 'pending');
        case `${ActionTypes.INVOICE_PUT}_FULFILLED`: {
            const index = state.invoices.findIndex(x => x.id === action.payload.id);
            const newState = [...state.invoices];
            newState[index] = action.payload;
            return Immutable.merge(state, {
                invoices: newState,
                invoicesPutStatus: 'fulfilled'
            });
        }

        case `${ActionTypes.INVOICE_PUT}_REJECTED`:
            return state.set('invoicesPutStatus', 'rejected');

    default:
        return state;
    };
};

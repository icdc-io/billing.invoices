/* eslint-disable new-cap */
import React, { useState, useEffect } from 'react';
import * as ActionTypes from '../AppConstants';
import PropTypes from 'prop-types';
import { PaymentStatuses } from './enumeration';
import { Icon, Input, Loader, Pagination, Table } from 'semantic-ui-react';
import EditInvoice from './editInvoicesModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoicesData, putInvoice } from '../AppActions';
import { withRouter } from 'react-router-dom';
import ErrorPage from './errorPage';

const Invoices = ({ t, isPayEnable, history }) => {
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage, setInvoicesPerPage] = useState(10)

    const invoices = useSelector(state => state.InvoicesStore.invoices);
    const invoicesFetchStatus = useSelector(state => state.InvoicesStore.invoicesFetchStatus);
    const invoicesPutStatus = useSelector(state => state.InvoicesStore.invoicesPutStatus);
    const { location, account } = useSelector(state => state.host.user);

    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/invoices');

    const getPaidStatusMessage = (status) => {
        switch (status) {
            case PaymentStatuses.Unpaid:
                return t('unpaid');
            case PaymentStatuses.Paid:
                return t('paid');
            case PaymentStatuses.PostDue:
                return t('postDue');
            case PaymentStatuses.Draft:
                return t('draft');
            default:
                return '';
        }
    };

    const invoicesList = [...invoices].filter((item) => {
        const searchString = search?.toLowerCase().trim()
        if (searchString === '') {
            return item;
        }

        const status = getPaidStatusMessage(item.status);

        return item.account?.toString().toLowerCase().includes(searchString)
            || item.amount?.toString().toLowerCase().includes(searchString)
            || item.name?.toString().toLowerCase().includes(searchString)
            || item.number?.toString().toLowerCase().includes(searchString)
            || status?.toLowerCase().includes(searchString)
    }).sort((a, b) => {
        const date1 = Date.parse(a.payment_date);
        const date2 = Date.parse(b.payment_date);
        return date2 - date1;
    });

    const calculatePagesCount = () => {
        const totalCount = invoicesList.length;
        return totalCount < invoicesPerPage ? 1 : Math.ceil(totalCount / invoicesPerPage);
    };

    const handlePaginationChange = (e, { activePage }) => setCurrentPage(activePage)

    const onSearch = (e) => {
        setCurrentPage(1);
        setSearch(e.currentTarget.value)
    }

    const openEditInvoiceModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsOpenEditModal(true);
    };

    const updateGrid = () => {
        account && dispatch(fetchInvoicesData());
    };

    useEffect(updateGrid, [location, account]);

    const roundToTwo = (num) => {
        return +(Math.round(num + 'e+2') + 'e-2');
    };

    const setCurrency = (currency, amount) => {
        const roundedAmount = roundToTwo(amount);
        switch (currency.toUpperCase()) {
            case 'USD':
                return <span>&#36; {roundedAmount}</span>;
            case 'RUB':
                return <span>&#8381; {roundedAmount}</span>;
            case 'PLN':
                return <span>&#x142; {roundedAmount}</span>;
            case 'EUR':
                return <span>&#8364; {roundedAmount}</span>;
            case 'BGN':
                return <span>&#8364; {roundedAmount}</span>;
            case 'GBP':
                return <span>&#163; {roundedAmount}</span>;
            case 'UAH':
                return <span>&#8372; {roundedAmount}</span>;
            case 'CZK':
                return <span>K&#x10D; {roundedAmount}</span>;
            default:
                return <span>{roundedAmount} {currency.toUpperCase()}</span>;
        }
    };

    const onCancel = () => {
        setIsOpenEditModal(false);
        setSelectedInvoice(null);
    };

    const onSave = (invoice) => {
        dispatch(putInvoice(invoice));
        setIsOpenEditModal(false);
        setSelectedInvoice(null);
    };

    const getPaidStatusClass = (status) => {
        switch (status) {
            case PaymentStatuses.Unpaid:
                return 'unpaid';
            case PaymentStatuses.Paid:
                return 'paid';
            case PaymentStatuses.PostDue:
                return 'post_due';
            default:
                return '';
        }
    };

    const lastInvoiceIndex = currentPage * invoicesPerPage;
    const firstInvoiceIndex = lastInvoiceIndex - invoicesPerPage;

    const totalPages = calculatePagesCount();

    const invoicesListPage =
        invoicesList
            .filter((_, index) => index > firstInvoiceIndex)
            .filter((_, index) => index <= invoicesPerPage - 1)
            .map(invoice => (
                <Table.Row key={invoice.id}>
                    <Table.Cell className='nameInvoice firstColumnCell'>
                        <a href={ActionTypes.INVOICES_ITEM_FETCH_URL_PDF(invoice.id)} target={'_blank'} rel="noopener noreferrer" >
                            {invoice.name}
                        </a>
                    </Table.Cell>
                    {!isPayEnable && <Table.Cell>
                        <p>{invoice.account}</p>
                        <p className='titleTable'>{t('account')}</p>
                    </Table.Cell>}
                    <Table.Cell>
                        <p>{invoice.number}</p>
                        <p className='titleTable'>{t('invoiceId')}</p>
                    </Table.Cell>
                    <Table.Cell>
                        <p>{invoice.due_date}</p>
                        <p className='titleTable'>{t('dueTo')}</p>
                    </Table.Cell>
                    <Table.Cell>
                        <p className={getPaidStatusClass(invoice.status)}>{getPaidStatusMessage(invoice.status)}</p>
                        <p className='titleTable'>{t('status')}</p>
                    </Table.Cell>
                    <Table.Cell>
                        <p>{invoice.payment_method || '-'}</p>
                        <p className='titleTable'>{t('paymentMethod')}</p>
                    </Table.Cell>
                    <Table.Cell>
                        <p>{invoice.payment_date}</p>
                        <p className='titleTable'>{t('paymentDate')}</p>
                    </Table.Cell>
                    <Table.Cell>
                        <p>{setCurrency(invoice.currency, invoice.amount)}</p>
                        <p className='titleTable'>{t('total')}</p>
                    </Table.Cell>
                    <Table.Cell>
                        {isPayEnable ?
                            invoice.status === PaymentStatuses.PostDue &&
                            <input
                                className='btn btn-blue'
                                type='button'
                                value={t('payNow')} />
                            :
                            <Icon color='grey' name='pencil alternate' onClick={() => { openEditInvoiceModal(invoice); }} />
                        }
                    </Table.Cell>
                </Table.Row>
            ));

    if (invoicesFetchStatus === 'rejected') {
        return <ErrorPage t={t} />
    }

    if (invoicesFetchStatus === 'pending') {
        return <Loader active inline='centered' />;
    }

    return (<div className={'container'}>
        <section className='billing'>
            <h3 className='blockTitle'>{t('invoices')}</h3>
            <Input
                icon='search'
                iconPosition='left'
                placeholder={t('searchField')}
                style={{ width: '400px', margin: '0px 0px 0px 25px' }}
                value={search}
                onChange={onSearch}
            />
            <Table basic='very'>
                <Table.Body>
                    {invoicesListPage}
                </Table.Body>
            </Table>
            {search && invoicesList.length === 0 &&
                <div className='empty-table'>{t('noSearchResults')}</div>
            }
        </section>
        {selectedInvoice && <EditInvoice
            t={t}
            open={isOpenEditModal}
            onCancel={onCancel}
            onSave={onSave}
            invoice={selectedInvoice}
            isSaving={invoicesPutStatus === 'pending'} />
        }
        {invoicesList.length > 9 &&
            <div className='pagination-wrapper'>
                <Pagination
                    activePage={currentPage}
                    size='tiny'
                    onPageChange={handlePaginationChange}
                    totalPages={totalPages}
                />
            </div>
        }
    </div>
    );
};

Invoices.propTypes = {
    t: PropTypes.func,
    isPayEnable: PropTypes.bool
};

export default withRouter(Invoices);

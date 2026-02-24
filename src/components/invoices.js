import ErrorScreen from "container/ErrorScreen";
import { Input } from "container/Input";
import Loader from "container/Loader";
import Paginator from "container/Paginator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import { Table, TableBody, TableCell, TableRow } from "container/Table";
import { getCurrentAppropriateLang } from "container/getCurrentAppropriateLang";
import { Pen } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoicesData, putInvoice } from "../AppActions";
import * as ActionTypes from "../AppConstants";
import { isInvalidDate } from "../constants/toClientTimezone";
import { debounce } from "../utils/debounce";
import EditInvoice from "./editInvoicesModal";
import { PaymentStatuses } from "./enumeration";

const debouncedFetchInvoices = debounce((dispatch, params) => {
	dispatch(fetchInvoicesData(params));
}, 1000);

const DEFAULT_PER_PAGE = 10;

const Invoices = ({ isPayEnable }) => {
	const { t } = useTranslation();

	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [filterByStatus, setFilterByStatus] = useState(0);

	const invoices = useSelector((state) => state.InvoicesStore.invoices);
	const invoicesTotalCount = useSelector(
		(state) => state.InvoicesStore.invoicesTotalCount,
	);
	const invoicesFetchStatus = useSelector(
		(state) => state.InvoicesStore.invoicesFetchStatus,
	);
	const invoicesPutStatus = useSelector(
		(state) => state.InvoicesStore.invoicesPutStatus,
	);
	const { location, account, role } = useSelector((state) => state.host.user);
	const lang = useSelector((state) => state.host.lang);

	const dispatch = useDispatch();

	const statusFilters = [
		{ title: "all", value: 0 },
		{ title: "paidInvoices", value: PaymentStatuses.Paid },
		{ title: "unPaidInvoices", value: PaymentStatuses.Unpaid },
		{ title: "draftInvoices", value: PaymentStatuses.Draft },
		{ title: "postDueInvoices", value: PaymentStatuses.PostDue },
	];

	const getPaidStatusMessage = (status) => {
		switch (status) {
			case PaymentStatuses.Unpaid:
				return t("unpaid");
			case PaymentStatuses.Paid:
				return t("paid");
			case PaymentStatuses.PostDue:
				return t("postDue");
			case PaymentStatuses.Draft:
				return t("draft");
			default:
				return "";
		}
	};

	function buildQueryParams(params) {
		const query = [
			`page[limit]=${params.pageLimit}`,
			`page[offset]=${params.pageOffset}`,
			"sort=-due_date",
		];
		const searchString = params.search.trim();

		if (searchString) {
			query.push(`filter[search]=${searchString}`);
		}

		if (params.filter) {
			query.push(`filter[status]=${params.filter}`);
		}

		return `?${query.join("&")}`;
	}

	const handlePaginationChange = (activePage) => setCurrentPage(activePage);

	const handleInputSearch = (e) => {
		const value = e.currentTarget.value;
		value.trim() && setCurrentPage(1);
		setSearch(value);

		debouncedFetchInvoices(
			dispatch,
			buildQueryParams({
				pageOffset: currentPage,
				pageLimit: DEFAULT_PER_PAGE,
				search: value,
				filter: filterByStatus,
			}),
		);
	};

	const statusesOptions = statusFilters.map((el, i) => ({
		key: i,
		value: el.value,
		text: t(el.title),
	}));

	const openEditInvoiceModal = (invoice) => {
		setSelectedInvoice(invoice);
		setIsOpenEditModal(true);
	};

	useEffect(() => {
		account &&
			dispatch(
				fetchInvoicesData(
					buildQueryParams({
						pageOffset: currentPage,
						pageLimit: DEFAULT_PER_PAGE,
						search,
						filter: filterByStatus,
					}),
				),
			);
	}, [location, account, role, filterByStatus, currentPage]);

	const roundToTwo = (num) => {
		return +(Math.round(num + "e+2") + "e-2");
	};

	const setCurrency = (amount) => {
		const roundedAmount = roundToTwo(amount);
		return roundedAmount;
	};

	const onCancel = () => {
		setIsOpenEditModal(false);
		setSelectedInvoice(null);
	};

	const onSave = (invoice) => {
		dispatch(
			putInvoice(
				invoice,
				buildQueryParams({
					pageOffset: currentPage,
					pageLimit: DEFAULT_PER_PAGE,
					search,
					filter: filterByStatus,
				}),
			),
		);
		setIsOpenEditModal(false);
		setSelectedInvoice(null);
	};

	const getPaidStatusClass = (status) => {
		switch (status) {
			case PaymentStatuses.Unpaid:
				return "unpaid";
			case PaymentStatuses.Paid:
				return "paid";
			case PaymentStatuses.PostDue:
				return "post_due";
			default:
				return "";
		}
	};

	const currentAppropriateLang = getCurrentAppropriateLang(lang);

	const toLocaleDatetime = (datetime, withTime) => {
		if (isInvalidDate(datetime)) return "";
		const timeOptions = withTime
			? {
					hour: "2-digit",
					minute: "2-digit",
				}
			: {};
		return new Date(datetime).toLocaleString(currentAppropriateLang, {
			...timeOptions,
			day: "numeric",
			month: "numeric",
			year: "numeric",
		});
	};

	const invoicesListPage = invoices.map((invoice) => (
		<TableRow key={invoice.id}>
			<TableCell className="nameInvoice firstColumnCell">
				<a
					href={ActionTypes.INVOICES_ITEM_FETCH_URL_PDF(invoice.id)}
					target={"_blank"}
					rel="noopener noreferrer"
				>
					{invoice.name}
				</a>
			</TableCell>
			{!isPayEnable && (
				<TableCell>
					<p>{invoice.account}</p>
					<p className="titleTable">{t("account")}</p>
				</TableCell>
			)}
			<TableCell>
				<p>{invoice.number}</p>
				<p className="titleTable">{t("invoiceId")}</p>
			</TableCell>
			<TableCell>
				<p>{toLocaleDatetime(invoice.due_date)}</p>
				<p className="titleTable">{t("dueTo")}</p>
			</TableCell>
			<TableCell>
				<p className={getPaidStatusClass(invoice.status)}>
					{getPaidStatusMessage(invoice.status)}
				</p>
				<p className="titleTable">{t("status")}</p>
			</TableCell>
			<TableCell>
				<p>{invoice.payment_method || "-"}</p>
				<p className="titleTable">{t("paymentMethod")}</p>
			</TableCell>
			<TableCell>
				<p>{toLocaleDatetime(invoice.payment_date, true) || "-"}</p>
				<p className="titleTable">{t("paymentDate")}</p>
			</TableCell>
			<TableCell>
				<p>{setCurrency(invoice.amount)}</p>
				<p className="titleTable">{t("total")}</p>
			</TableCell>
			<TableCell>
				{isPayEnable ? (
					invoice.status === PaymentStatuses.PostDue && (
						<input className="btn btn-blue" type="button" value={t("payNow")} />
					)
				) : (
					<button
						type="button"
						onClick={() => {
							openEditInvoiceModal(invoice);
						}}
					>
						<Pen size={16} />
					</button>
				)}
			</TableCell>
		</TableRow>
	));

	if (invoicesFetchStatus === "rejected") {
		return <ErrorScreen />;
	}

	const handleFiltersChange = (value) => {
		setCurrentPage(1);
		setFilterByStatus(value);
	};

	return (
		<div className={"billing_invoices h-full"}>
			<section className="billing h-full flex flex-col">
				<h3 className="blockTitle">{t("invoices")}</h3>
				<div className="flex flex-wrap gap-2 items-center">
					<div className="small-input">
						<Input
							variant="search"
							placeholder={t("searchField")}
							value={search}
							onChange={handleInputSearch}
						/>
					</div>
					<div>
						<Select
							defaultValue={filterByStatus}
							onValueChange={handleFiltersChange}
						>
							<SelectTrigger>
								<SelectValue placeholder={t("all")} />
							</SelectTrigger>
							<SelectContent>
								{statusesOptions.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.text}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<br />
				{/* //todo - for future use(multiple filters)<Filter t={t} onChange={handleFiltersChange} /> */}

				<div className="min-h-table">
					{invoicesFetchStatus === "pending" ? (
						<Loader className="m-auto" />
					) : (
						<Table>
							<TableBody>
								{invoices.length > 0 ? (
									invoicesListPage
								) : (
									<div className="empty-table">{t("noSearchResults")}</div>
								)}
							</TableBody>
						</Table>
					)}
				</div>
				{invoicesTotalCount > 9 && (
					<div className="pagination-wrapper">
						<Paginator
							currentPage={currentPage}
							onPageChange={handlePaginationChange}
							totalPages={Math.ceil(invoicesTotalCount / DEFAULT_PER_PAGE)}
						/>
					</div>
				)}
			</section>
			{selectedInvoice && (
				<EditInvoice
					open={isOpenEditModal}
					onCancel={onCancel}
					onSave={onSave}
					invoice={selectedInvoice}
					isSaving={invoicesPutStatus === "pending"}
				/>
			)}
		</div>
	);
};

export default Invoices;

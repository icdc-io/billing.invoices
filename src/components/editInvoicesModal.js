import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import PropTypes from "prop-types";
import { useState } from "react";
import { PaymentStatuses } from "./enumeration";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "container/Button";
import { Input } from "container/Input";
import { Label } from "container/Label";
import { isAdminRights } from "container/roleUtils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isInvalidDate } from "../constants/toClientTimezone";

const EditInvoice = ({ open, onSave, onCancel, invoice, isSaving }) => {
	const { t } = useTranslation();
	const { name, due_date, status, payment_method, payment_date, id } = invoice;
	const [invoiceData, setInvoiceData] = useState({
		id,
		name,
		due_date,
		status,
		payment_method,
		payment_date: isInvalidDate(payment_date) ? "" : new Date(payment_date),
	});
	const { role } = useSelector((state) => state.host.user);
	const locale = useSelector((state) => state.host.lang);

	const formatDate = (date) => {
		if (!date) {
			return null;
		}

		let month = `${date.getMonth() + 1}`;
		let day = `${date.getDate()}`;
		const year = date.getFullYear();

		if (month.length < 2) {
			month = `0${month}`;
		}

		if (day.length < 2) {
			day = `0${day}`;
		}

		return [year, month, day].join("-");
	};

	const onChange = (e) => {
		setInvoiceData({ ...invoiceData, [e.target.id]: e.target.value });
	};

	const onChangeDueDate = (data) => {
		setInvoiceData({ ...invoiceData, due_date: data ? formatDate(data) : "" });
	};

	const onChangePaymentDate = (data) => {
		setInvoiceData({ ...invoiceData, payment_date: data || "" });
	};

	const clearPaymentDate = () => {
		setInvoiceData({ ...invoiceData, payment_date: "" });
	};

	const statusOptions = [
		{
			key: PaymentStatuses.Unpaid,
			text: t("unpaid"),
			value: PaymentStatuses.Unpaid,
		},
		{
			key: PaymentStatuses.Paid,
			text: t("paid"),
			value: PaymentStatuses.Paid,
		},
		{
			key: PaymentStatuses.PostDue,
			text: t("postDue"),
			value: PaymentStatuses.PostDue,
		},
		{
			key: PaymentStatuses.Draft,
			text: t("draft"),
			value: PaymentStatuses.Draft,
		},
	];

	return (
		<Dialog open={open} onOpenChange={onCancel}>
			<DialogContent className="billing_invoices_modal">
				<DialogHeader>
					<DialogTitle>{t("editInvoice")}</DialogTitle>
				</DialogHeader>
				<div>
					<Label>
						<b>{t("label")}</b>
					</Label>
					<Input
						error={!invoiceData.name}
						id="name"
						type="text"
						value={invoiceData.name}
						onChange={onChange}
						disabled={isSaving}
					/>
				</div>

				<div>
					<Label>
						<b>{t("dueTo")}</b>
					</Label>
					<DatePicker
						id="due_date"
						locale={locale}
						onChange={onChangeDueDate}
						minDate={isAdminRights(role) ? null : new Date()}
						dateFormat={locale === "en" ? "dd/MM/yyyy p" : "dd.MM.yyyy HH:mm"}
						placeholderText={t("date")}
						className="flex h-9 w-full rounded-md border border-input border-solid bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						value={invoiceData.due_date}
					/>
				</div>

				<div>
					<Label>
						<b>{t("status")}</b>
					</Label>
					<Select
						value={invoiceData.status}
						onValueChange={(value) =>
							setInvoiceData({ ...invoiceData, status: value })
						}
						disabled={isSaving}
					>
						<SelectTrigger>
							<SelectValue placeholder={t("notSelected")} />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.text}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label>
						<b>{t("paymentMethod")}</b>
					</Label>
					<Input
						className="input-block"
						placeholder={t("notSelected")}
						fluid
						id="payment_method"
						onChange={onChange}
						value={invoiceData.payment_method}
						disabled={isSaving}
					/>
				</div>

				<div>
					<Label>
						<b>{t("paymentDate")}</b>
					</Label>
					<div className="paymentDateWrapper">
						<DatePicker
							id="payment_date"
							locale={locale}
							onChange={onChangePaymentDate}
							selected={invoiceData.payment_date}
							popperPlacement="top-start"
							placeholderText={t("date")}
							showTimeSelect
							timeFormat={locale === "en" ? "p" : "HH:mm"}
							dateFormat={locale === "en" ? "dd/MM/yyyy p" : "dd.MM.yyyy HH:mm"}
							className="flex h-9 w-full rounded-md border border-input border-solid bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<button
							type="button"
							className="clear-btn"
							onClick={clearPaymentDate}
						>
							<X size={16} />
						</button>
					</div>
				</div>

				<DialogFooter align="right">
					<DialogClose asChild>
						<Button onClick={onCancel} variant="secondary">
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button
						disabled={isSaving || !invoiceData.name}
						onClick={() => {
							onSave(invoiceData);
						}}
					>
						{t("save")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

EditInvoice.propTypes = {
	t: PropTypes.func,
	open: PropTypes.bool,
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
	invoice: PropTypes.any,
	isSaving: PropTypes.bool,
};

export default EditInvoice;

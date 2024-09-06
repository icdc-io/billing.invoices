import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Input,
  Modal,
} from "semantic-ui-react";
import { PaymentStatuses } from "./enumeration";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isInvalidDate } from "../constants/toClientTimezone";

const EditInvoice = ({ open, onSave, onCancel, invoice, isSaving }) => {
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState({
    ...invoice,
    payment_date: isInvalidDate(invoice.payment_date)
      ? ""
      : new Date(invoice.payment_date),
  });
  const { role } = useSelector((state) => state.host.user);
  const locale = useSelector((state) => state.host.lang);

  const formatDate = (date) => {
    if (!date) {
      return null;
    }

    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }

    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  };

  const onChange = (e, data) => {
    setInvoiceData({ ...invoiceData, [data.id]: data.value });
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
    <Modal size="tiny" open={open} className="billing_invoices_modal">
      <Modal.Content>
        <div className="close-btn" onClick={onCancel} />
        <Header
          as="h2"
          style={{ margin: "auto 0 26px 0" }}
          content={t("editInvoice")}
        />
        <label>{t("label")}</label>
        <Input
          error={!invoiceData.name}
          id="name"
          type="text"
          value={invoiceData.name}
          onChange={onChange}
          disabled={isSaving}
        />
        <label>{t("dueTo")}</label>
        <DatePicker
          id="due_date"
          locale={locale}
          onChange={onChangeDueDate}
          minDate={role === "admin" ? null : new Date()}
          dateFormat={locale === "en" ? "dd/MM/yyyy p" : "dd.MM.yyyy HH:mm"}
          placeholderText={t("date")}
          value={invoiceData.due_date}
        />
        <label>{t("status")}</label>
        <Dropdown
          id="status"
          style={{ width: "100%" }}
          placeholder={t("notSelected")}
          fluid
          selection
          options={statusOptions}
          onChange={onChange}
          value={invoiceData.status}
          disabled={isSaving}
        />
        <label>{t("paymentMethod")}</label>
        <Input
          className="input-block"
          placeholder={t("notSelected")}
          fluid
          id="payment_method"
          onChange={onChange}
          value={invoiceData.payment_method}
          disabled={isSaving}
        />
        <label>{t("paymentDate")}</label>
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
          />
          <Icon name="delete" color="grey" onClick={clearPaymentDate} />
        </div>
        <div className="btns">
          <Modal.Actions align="right">
            <Button content={t("cancel")} onClick={onCancel} />
            <Button
              disabled={isSaving || !invoiceData.name}
              color="blue"
              content={t("save")}
              onClick={() => {
                onSave(invoiceData);
              }}
            />
          </Modal.Actions>
        </div>
      </Modal.Content>
    </Modal>
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

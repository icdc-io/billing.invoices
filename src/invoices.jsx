import React, { useEffect, useState } from "react";
import { InvoicesStore } from "./AppReducer";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./App.scss";

const InvoicesComponent = React.lazy(() => import("./components/invoices"));

const Invoices = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.injectReducer("InvoicesStore", InvoicesStore);
    setIsLoaded(true);
  }, []);

  return isLoaded ? <InvoicesComponent /> : <Loader active inline="centered" />;
};

Invoices.propTypes = {
  store: PropTypes.object,
};

export default Invoices;

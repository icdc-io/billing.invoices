import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { InvoicesStore } from './AppReducer';
import './App.scss';

const InvoicesComponent = React.lazy(() => import('./components/invoices'));

const Invoices = ({ t, store }) => {
  useEffect(() => {
    store.injectReducer('InvoicesStore', InvoicesStore);
  }, []);

  return <Provider store={store}>
    <Router basename={process.env.NODE_ENV === 'production' ? '/billing' : ''}>
      <InvoicesComponent t={t} />
    </Router>
  </Provider>;
};

export default Invoices;

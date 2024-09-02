import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Header, Icon, Segment } from "semantic-ui-react";

const ErrorPage = ({ auth }) => {
  const { t } = useTranslation();

  return (
    <div className="general-container">
      <Segment placeholder className="error-content">
        <Header icon>
          <Icon name="exclamation triangle" size="huge" />
          <h2>{t([auth ? "denied" : "error"])}</h2>
          <h6>{t([auth ? "noAccess" : "errorDescription"])}</h6>
        </Header>
      </Segment>
    </div>
  );
};

ErrorPage.propTypes = {
  t: PropTypes.func,
  auth: PropTypes.bool,
};

export default ErrorPage;

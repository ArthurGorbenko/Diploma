import React from 'react';
import {Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';
import {history} from 'config/store';
import routes from 'config/routes';
import RouteWithSubRoutes from 'lib/route-with-subroutes';
import withIntl from 'lib/intl/withIntl';
import {StylesProvider} from '@material-ui/core/styles';
import OfflineModal from 'ui/OfflineModal';
import {LoadingOverlay} from 'ui/LoadingOverlay';
import {ModalAuth} from 'ui/ModalAuth';

const Root = () => (
  <StylesProvider injectFirst>
    <ConnectedRouter history={history}>
      <Switch>
        {routes.map(route => (
          <RouteWithSubRoutes key={route.path} {...route} />
        ))}
      </Switch>
      <OfflineModal />
      <LoadingOverlay />
      <ModalAuth />
    </ConnectedRouter>
  </StylesProvider>
);

export default withIntl(Root);

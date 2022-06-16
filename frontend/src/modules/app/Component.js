import React from 'react';
import PropTypes from 'prop-types';
import {Nav} from '../nav';
import {Switch} from 'react-router-dom';
import RouteWithSubRoutes from 'lib/route-with-subroutes';
import {styled} from '@material-ui/core';
import {Navbar} from 'ui/Navbar';

const Wrapper = styled('div')({
  display: 'flex',
});
const Content = styled('div')({
  marginTop: 64,
  width: '100%',
});

export const App = ({routes}) => {
  return (
    <Wrapper>
      <Nav />
      <Navbar />
      <Content>
        <Switch>
          {routes.map(route => (
            <RouteWithSubRoutes key={route.path} {...route} />
          ))}
        </Switch>
      </Content>
    </Wrapper>
  );
};

App.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default App;

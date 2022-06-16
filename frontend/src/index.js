import React from 'react';
import {render} from 'react-dom';
import * as serviceWorker from './serviceWorker';
import messages from 'lib/intl/messages';
import Root from './Root';
import {Provider} from 'react-redux';
import store from 'config/store';
import './app.css';

render(
  <Provider store={store}>
    <Root messages={messages} />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

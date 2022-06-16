import React from 'react';
import {isNil} from 'ramda';
import {branch, renderNothing} from 'recompose';
import {IntlProvider} from 'react-intl';
import {InjectIntlContext} from './hooks';
// import {withUserLocale} from '../api/hoc';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getLocale} from 'modules/user/ducks';

export default App =>
  (({locale, messages, ...props}) => {
    let key = 'en';
    if (!locale) {
      // could get browser or user pref (using withUserLocale hoc) language here
    }
    if (messages[locale]) {
      key = locale;
    }

    dayjs.locale(key);

    return (
      <IntlProvider locale={key} key={key} messages={messages[key]}>
        <InjectIntlContext>
          <App {...props} />
        </InjectIntlContext>
      </IntlProvider>
    );
  })
  |> branch(({messages}) => isNil(messages), renderNothing)
  |> connect(
    createStructuredSelector({
      locale: getLocale,
    }),
  );
// |> withUserLocale

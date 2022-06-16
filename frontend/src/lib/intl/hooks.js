import React, {createContext, useContext} from 'react';
import {injectIntl} from 'react-intl';

const IntlContext = createContext({});

// turn the old context into the new context
export const InjectIntlContext = injectIntl(({intl, children}) => {
  return <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>;
});

/*export const useFormatMessage = () => {
  const intl = useContext(IntlContext);
  return intl.formatMessage;
};*/

export const useMessages = (ids, namespace) => {
  const intl = useContext(IntlContext);
  const msg = {};
  const ns = namespace ? `${namespace}.` : '';

  ids.forEach(id => {
    msg[id] = intl.formatMessage({id: `${ns}${id}`});
  });
  return msg;
};

export const useMessage = (namespace = null) => {
  const intl = useContext(IntlContext);

  if (!intl.formatMessage) return id => id; // in case intl not initialized yet (should not happen)

  const ns = namespace ? `${namespace}.` : '';

  return id => intl.formatMessage({id: `${ns}${id}`});
};

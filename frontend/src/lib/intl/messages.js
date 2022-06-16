// import en from 'react-intl/locale-data/en';
// import fr from 'react-intl/locale-data/fr';
import enMessages from 'messages/en.json';
import ukMessages from 'messages/uk.json';
// import {addLocaleData} from 'react-intl';

export const flatten = object => {
  return Object.assign(
    {},
    ...(function _flatten(objectBit, path = '') {
      return [].concat(
        ...Object.keys(objectBit).map(key =>
          typeof objectBit[key] === 'object'
            ? _flatten(objectBit[key], `${path}${path ? '.' : ''}${key}`)
            : {[`${path}${path ? '.' : ''}${key}`]: objectBit[key]},
        ),
      );
    })(object),
  );
};

// addLocaleData([...en, ...uk]);

const enFlatten = flatten(enMessages);
const ukFlatten = flatten(ukMessages);

export default {
  en: enFlatten,
  uk: {...enFlatten, ...ukFlatten},
};

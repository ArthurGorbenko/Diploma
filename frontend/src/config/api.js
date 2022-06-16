export const DEV_MODE = process.env.NODE_ENV === 'development';
export const URL = DEV_MODE ? 'http://localhost:8000/' : 'https://app.pixelretail.com/';
export const URL_ADMIN = DEV_MODE ? 'http://localhost:3000/' : 'https://admin.pixelretail.com/';
export const API_URL = `${URL}api`;
export const API_HEALTH_URL = `${API_URL}/health`;
export const UPLOADS_URL = `${URL}uploads`;
export const DEFAULT_PAGE = '/slideshow';

const LS = localStorage;

export const credentials = {
  set: ({uuid, license, role, locale}) => {
    if (uuid) {
      LS.setItem('uuid', uuid);
    }
    if (license) {
      LS.setItem('license', license);
    }
    if (role) {
      LS.setItem('role', role);
    }
    if (locale) {
      LS.setItem('locale', locale);
    }
  },
  get: () => ({
    uuid: LS.getItem('uuid'),
    license: LS.getItem('license'),
    role: LS.getItem('role'),
    locale: LS.getItem('locale'),
  }),
  delete: () => {
    LS.clear();
  },
};

export const asset = path => `${UPLOADS_URL}/${path}`;

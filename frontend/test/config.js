export const URL_API = 'http://localhost:8000/';
export const URL_APP = 'http://localhost:3000/';
export const CREDENTIALS_CLIENT = 'test_shop_uuid/test_shop_license';
export const CREDENTIALS_ADMIN = 'test_root_uuid/test_root_license';
export const SHOP_NAME = 'test shop';

export const route = (endoint, isAdmin = true) =>
  `${URL_API}api/${isAdmin ? CREDENTIALS_ADMIN : CREDENTIALS_CLIENT}/${endoint}`;
export const crud = entity => `${URL_APP}${entity}/`;

export const URL_APP_AUTH_ADMIN = `${URL_APP}auth/${CREDENTIALS_ADMIN}`;
export const URL_APP_AUTH_CLIENT = `${URL_APP}auth/${CREDENTIALS_CLIENT}`;
export const URL_API_MEDIA_ADMIN = route('upload');
export const URL_API_MEDIA_CLIENT = route('upload', false);

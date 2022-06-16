import {API_URL} from 'config/api';

const headers = new Headers({
  'content-type': 'application/json',
});

const _fetch = (url, options, isHeadersRequired = true) => {
  const license = localStorage.getItem('license');
  const uuid = localStorage.getItem('uuid');
  const requestBody = {...options};
  if (isHeadersRequired) {
    requestBody.headers = headers;
  }
  return fetch(`${API_URL}/${uuid}/${license}/${url}`, requestBody)
    .then(response => {
      return response.json();
      /*
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') > -1) {
        return response.json();
      }
      return response;
    */
    })
    .then(data => data)
    .catch(error => ({error}));
};

const get = url => _fetch(url, {method: 'GET'});

const post = (url, body) => _fetch(url, {method: 'POST', body});

const postFile = (url, body) => _fetch(url, {method: 'POST', body}, false);

const update = (url, body) => _fetch(url, {method: 'PATCH', body});

const del = url => _fetch(url, {method: 'DELETE'});

export {get, post, postFile, update, del};

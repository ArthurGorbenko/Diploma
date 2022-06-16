import {Selector, RequestLogger} from 'testcafe';
import {URL_APP_AUTH_ADMIN, crud, URL_APP_AUTH_CLIENT} from './config';

const URL_APP_CATEGORIES = crud('categories');
const URL_APP_PRODUCTS = crud('products');

const deleteReq = RequestLogger(
  {method: 'delete'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Delete test data`.page`${URL_APP_AUTH_ADMIN}`.requestHooks([deleteReq]);

test('delete test product', async t => {
  await t.navigateTo(URL_APP_AUTH_CLIENT).navigateTo(URL_APP_PRODUCTS);

  await t
    .click(Selector('td').withExactText('test product changed'))
    .click(Selector('.delete-product'))
    .click('.delete-confirm')
    .expect(deleteReq.contains(({response: {statusCode}}) => statusCode < 202))
    .ok();
  const {status} = await JSON.parse(deleteReq.requests[0].response.body);
  await t.expect(status === 'ok').ok('Product deleted');
});

test('delete test categories', async t => {
  await t.navigateTo(URL_APP_CATEGORIES);

  await t
    .click(Selector('td').withExactText('test category'))
    .click('.delete-category')
    .click('.delete-confirm')
    .expect(deleteReq.contains(({response: {statusCode}}) => statusCode < 202))
    .ok('Server response ok');
  const {status} = await JSON.parse(deleteReq.requests[0].response.body);
  await t.expect(status === 'ok').ok('test category deleted');

  await t
    .click(Selector('td').withExactText('test category1'))
    .click('.delete-category')
    .click('.delete-confirm')
    .expect(deleteReq.contains(({response: {statusCode}}) => statusCode < 202))
    .ok('Server response ok');
  const {status: statusCategory1} = await JSON.parse(deleteReq.requests[0].response.body);
  await t.expect(statusCategory1 === 'ok').ok('test category1 deleted');
});

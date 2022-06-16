import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {URL_APP_AUTH_ADMIN, route, crud} from './config';
import dayjs from 'dayjs';

const URL_APP_CATEGORIES = crud('categories');
const URL_APP_SHOPS = crud('shops');
const URL_APP_SLIDESHOWS = crud('slideshow');

const post = RequestLogger(
  {method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const patch = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Create test data`.page`${URL_APP_AUTH_ADMIN}`.requestHooks([post, patch]).beforeEach(async t => {
  t.ctx.categoryName = 'test category1';
});

test('Create test category', async t => {
  await t.navigateTo(URL_APP_CATEGORIES);
  await t.click(Selector('a.category-create'));

  let location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_CATEGORIES}create`).ok('navigation to create category ok');

  const categoryNameField = '#categoryNameField';
  await t
    .typeText(categoryNameField, t.ctx.categoryName)
    .expect(Selector(categoryNameField).value)
    .eql(t.ctx.categoryName);

  await t.click("button[type='submit']");
  await t.expect(post.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id, name},
  } = await JSON.parse(post.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_CATEGORIES}view/${id}` && name === t.ctx.categoryName)
    .ok('navigation to view of created shop');
});

test('Add category and designs for the test shop', async t => {
  await t.navigateTo(URL_APP_SHOPS);
  await t.click(Selector('td').withExactText('test shop')).click('.edit-shop');

  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(t.ctx.categoryName));

  await t.click(Selector('#designSelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(0));

  await t.click(Selector('#designSelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(1));

  await t.click("button[type='submit']");
  await t.expect(patch.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id, categories, designs},
  } = await JSON.parse(patch.requests[0].response.body);
  const location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_SHOPS}view/${id}` &&
        categories[1].name === t.ctx.categoryName &&
        designs.length === 2,
    )
    .ok('navigation to view of patched shop');
});

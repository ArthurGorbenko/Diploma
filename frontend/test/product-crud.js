import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {route, crud, URL_API_MEDIA_CLIENT, URL_APP_AUTH_CLIENT} from './config';

const URL_API_PRODUCTS = route('products', false);
const URL_APP_PRODUCTS = crud('products');

const productPost = RequestLogger(
  {url: URL_API_PRODUCTS, method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const productDelete = RequestLogger(
  {
    method: 'delete',
  },
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const productPatch = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const mediaPost = RequestLogger(
  {url: URL_API_MEDIA_CLIENT, method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Product CRUD`.page`${URL_APP_AUTH_CLIENT}`.requestHooks([
  mediaPost,
  productPost,
  productPatch,
  productDelete,
]);

test('Client create,view,edit,delete product', async t => {
  await t.navigateTo(URL_APP_PRODUCTS);
  await t.click(Selector('a.create-product'));

  let location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_PRODUCTS}create`).ok('navigation to create products ok');

  const productName = 'test product';
  await t
    .typeText('#productNameField', productName)
    .expect(Selector('#productNameField').value)
    .eql(productName);

  const categoryName = 'test category';
  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(categoryName));

  await t.click(Selector('#designSelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(0));

  await t.setFilesToUpload('.fileUploadInput', ['../src/assets/media_placeholder.jpg']);
  await t.expect(mediaPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {filename} = await JSON.parse(mediaPost.requests[0].response.body);
  await t.expect(filename.match('media_placeholder')).ok('recieved filename contains sent filename');

  await t.click("button[type='submit']");

  await t.expect(productPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id, title, media_link, category, designs},
  } = await JSON.parse(productPost.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_PRODUCTS}view/${id}` &&
        title === productName &&
        media_link === filename &&
        category.name === categoryName &&
        designs.length === 1,
    )
    .ok('navigation to view of created product');

  await t.click('.editProductsBtn');
  location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_PRODUCTS}edit/${id}`).ok('navigation to edit product');

  const nameChanges = ' changed';
  await t.typeText('#productNameField', nameChanges);

  const categoryNameChanged = 'test category1';
  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(categoryNameChanged));

  await t.click(Selector('#designSelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(1));

  await t.setFilesToUpload('.fileUploadInput', ['../src/assets/media_placeholder_changed.jpg']);
  await t.expect(mediaPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {filename: filePatched} = await JSON.parse(mediaPost.requests[1].response.body);
  await t
    .expect(filePatched.match('media_placeholder_changed'))
    .ok('recieved filename contains sent filename');

  await t.click("button[type='submit']");
  await t.expect(productPatch.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {
      title: changedTitle,
      media_link: chagnedMedia,
      designs: designsExtended,
      category: changedCategory,
    },
  } = await JSON.parse(productPatch.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_PRODUCTS}view/${id}` &&
        changedTitle === productName + nameChanges &&
        chagnedMedia === filePatched &&
        changedCategory.name === categoryNameChanged &&
        designsExtended.length === 2,
    )
    .ok('navigation to view of edited product');
});

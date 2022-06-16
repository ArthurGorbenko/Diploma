import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {URL_APP_AUTH_ADMIN, URL_API_MEDIA_ADMIN, route, crud} from './config';
import dayjs from 'dayjs';

const URL_API_SHOPS = route('shops');
const URL_APP_SHOPS = crud('shops');

const shopPost = RequestLogger(
  {url: URL_API_SHOPS, method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const shopPatch = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const shopDelete = RequestLogger(
  {method: 'delete'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const mediaPost = RequestLogger(
  {url: URL_API_MEDIA_ADMIN, method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Shop CRUD`.page`${URL_APP_AUTH_ADMIN}`.requestHooks([
  mediaPost,
  shopPost,
  shopPatch,
  shopDelete,
]);

test('Client create,view,edit,delete shop', async t => {
  await t.navigateTo(URL_APP_SHOPS);
  await t.click(Selector('a.create-shop'));

  let location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_SHOPS}create`).ok('navigation to create shops ok');

  const shopName = 'test shop';
  await t.typeText('#shopNameField', shopName).expect(Selector('#shopNameField').value).eql(shopName);

  const categoryName = 'test category';
  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(categoryName));

  const dateInput = Selector('#expirationDateInput');
  const expirationDate = '01/novembre/2021';
  const dateBtn = Selector('span').withExactText('OK').parent();
  let yearBtn = Selector('.MuiPickersYear-root').withExactText('2021');
  let monthBtn = Selector('.MuiPickersMonth-root').withExactText('nov.');
  let dayBtn = Selector('p.MuiTypography-colorInherit').withExactText('1').parent(0);
  await t
    .click(dateInput)
    .click(yearBtn)
    .click(monthBtn)
    .click(dayBtn)
    .click(dateBtn)
    .expect(Selector('#expirationDateInput').value)
    .eql(expirationDate);

  await t.setFilesToUpload('.fileUploadInput', ['../src/assets/media_placeholder.jpg']);
  await t.expect(mediaPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {filename} = await JSON.parse(mediaPost.requests[0].response.body);
  await t.expect(filename.match('media_placeholder')).ok('recieved filename contains sent filename');

  const disablingCheckbox = Selector('#disablingCheckbox');
  await t.click(Selector(disablingCheckbox));

  await t.click("button[type='submit']");
  await t.expect(shopPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id, name, logo, categories, expiration_date, disabled},
  } = await JSON.parse(shopPost.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_SHOPS}view/${id}` &&
        name === shopName &&
        logo === filename &&
        categories[0].name === categoryName &&
        expiration_date === dayjs(expirationDate).format('YYYY-MM-DD') &&
        disabled === true,
    )
    .ok('navigation to view of created shop');

  await t.click('a.edit-shop');
  location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_SHOPS}edit/${id}`).ok('navigation to edit shop');

  const nameChanges = ' changed';
  await t.typeText('#shopNameField', nameChanges);

  const categoryNameChanged = 'test category1';
  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(categoryNameChanged));

  await t.setFilesToUpload('.fileUploadInput', ['../src/assets/media_placeholder_changed.jpg']);
  await t.expect(mediaPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {filename: filePatched} = await JSON.parse(mediaPost.requests[1].response.body);
  await t
    .expect(filePatched.match('media_placeholder_changed'))
    .ok('recieved filename contains sent filename');

  const expirationDateChanged = '02/septembre/2022';
  yearBtn = Selector('.MuiPickersYear-root').withExactText('2022');
  monthBtn = Selector('.MuiPickersMonth-root').withExactText('sept.');
  dayBtn = Selector('p.MuiTypography-colorInherit').withExactText('2').parent(0);

  await t
    .click(dateInput)
    .click(yearBtn)
    .click(monthBtn)
    .click(dayBtn)
    .click(dateBtn)
    .expect(Selector('#expirationDateInput').value)
    .eql(expirationDateChanged);

  await t.click(Selector(disablingCheckbox));

  await t.click("button[type='submit']");
  await t.expect(shopPatch.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {
      name: changedName,
      logo: chagnedMedia,
      disabled: disabledChanged,
      expiration_date: dateChanged,
      categories: categoriesChanged,
    },
  } = await JSON.parse(shopPatch.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();

  await t
    .expect(
      location === `${URL_APP_SHOPS}view/${id}` &&
        changedName === shopName + nameChanges &&
        chagnedMedia === filePatched &&
        disabledChanged === false &&
        categoriesChanged[1].name === categoryNameChanged &&
        dateChanged === dayjs(expirationDateChanged).format('YYYY-MM-DD'),
    )
    .ok('navigation to view of edited shop');

  await t
    .click(Selector('.delete-shop'))
    .click('.delete-confirm')
    .expect(shopDelete.contains(({response: {statusCode}}) => statusCode < 202))
    .ok();
  const {status} = await JSON.parse(shopDelete.requests[0].response.body);
  await t.expect(status === 'ok').ok('Shop deleted');
});

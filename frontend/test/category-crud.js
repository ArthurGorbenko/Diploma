import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {URL_APP_AUTH_ADMIN, URL_API_MEDIA_ADMIN, route, crud} from './config';

const URL_API_CATEGORIES = route('categories');
const URL_APP_CATEGORIES = crud('categories');

const categoryPost = RequestLogger(
  {url: URL_API_CATEGORIES, method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const patchReq = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const deleteReq = RequestLogger(
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

const labelPost = RequestLogger(
  {method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Category CRUD`.page`${URL_APP_AUTH_ADMIN}`.requestHooks([
  mediaPost,
  categoryPost,
  patchReq,
  deleteReq,
  labelPost,
]);

test('Client create,view,edit,delete category', async t => {
  await t.navigateTo(URL_APP_CATEGORIES);
  await t.click(Selector('a.category-create'));

  let location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_CATEGORIES}create`).ok('navigation to create category ok');

  const categoryName = 'test category';
  const categoryNameField = '#categoryNameField';
  await t
    .typeText(categoryNameField, categoryName)
    .expect(Selector(categoryNameField).value)
    .eql(categoryName);

  await t.click("button[type='submit']");
  await t.expect(categoryPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id, name},
  } = await JSON.parse(categoryPost.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_CATEGORIES}view/${id}` && name === categoryName)
    .ok('navigation to view of created shop');

  await t.click('.edit-labels');
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_CATEGORIES}${id}/labels`)
    .ok('navigation to view of created shop');

  await t.click('.create-label');
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_CATEGORIES}${id}/labels/create`)
    .ok('navigation to view of created shop');

  const labelName = 'test label';
  const labelNameField = '#labelNameField';
  await t.typeText(labelNameField, labelName).expect(Selector(labelNameField).value).eql(labelName);

  await t.setFilesToUpload('.fileUploadInput', ['../src/assets/media_placeholder.jpg']);
  await t.expect(mediaPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {filename} = await JSON.parse(mediaPost.requests[0].response.body);
  await t.expect(filename.match('media_placeholder')).ok('recieved filename contains sent filename');

  await t.click("button[type='submit']");

  await t.expect(categoryPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id: labelId, name: labelNameRequested, category_id, image_link},
  } = await JSON.parse(
    labelPost.requests.filter(({request: {url}}) => url === `${URL_API_CATEGORIES}/${id}/labels`)[0]
      .response.body,
  );
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_CATEGORIES}${id}/labels/view/${labelId}` &&
        labelNameRequested === labelName &&
        filename === image_link &&
        id === category_id,
    )
    .ok('navigation to view of created label');

  await t.click('a.edit-label');
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_CATEGORIES}${id}/labels/edit/${labelId}`)
    .ok('navigation to edit label');

  const nameChanges = ' changed';
  await t.typeText(labelNameField, nameChanges);

  await t.setFilesToUpload('.fileUploadInput', ['../src/assets/media_placeholder_changed.jpg']);
  await t.expect(mediaPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {filename: filePatchReqed} = await JSON.parse(mediaPost.requests[1].response.body);
  await t
    .expect(filePatchReqed.match('media_placeholder_changed'))
    .ok('recieved filename contains sent filename');

  await t.click("button[type='submit']");

  await t.expect(patchReq.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {name: changedLabelName, image_link: imageLinkChanged},
  } = await JSON.parse(patchReq.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_CATEGORIES}${id}/labels/view/${labelId}` &&
        changedLabelName === labelName + nameChanges &&
        imageLinkChanged === filePatchReqed,
    )
    .ok('navigation to view of edited category');

  await t
    .click('.delete-label')
    .click('.delete-confirm')
    .expect(deleteReq.contains(({response: {statusCode}}) => statusCode < 202))
    .ok();
  const {status: isLabelDeleted} = await JSON.parse(deleteReq.requests[0].response.body);
  await t.expect(isLabelDeleted === 'ok').ok('label deleted');

  await t.navigateTo(`${URL_APP_CATEGORIES}view/${id}`);

  await t.click('a.edit-category');
  location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_CATEGORIES}edit/${id}`).ok('navigation to edit category');

  await t.typeText(categoryNameField, nameChanges);

  await t.click("button[type='submit']");
  await t.expect(patchReq.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {name: changedCategoryName},
  } = await JSON.parse(patchReq.requests[1].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_CATEGORIES}view/${id}` &&
        changedCategoryName === categoryName + nameChanges,
    )
    .ok('navigation to view of edited category');

  await t
    .click('.delete-category')
    .click('.delete-confirm')
    .expect(deleteReq.contains(({response: {statusCode}}) => statusCode < 202))
    .ok();
  const {status: isCategoryDeleted} = await JSON.parse(deleteReq.requests[1].response.body);
  await t.expect(isCategoryDeleted === 'ok').ok('category deleted');
});

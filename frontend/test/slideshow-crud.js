import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {URL_APP_AUTH_ADMIN, route, crud} from './config';
import {isEmpty} from 'ramda';

const URL_API_SLIDESHOWS = route('slideshows');
const URL_APP_SLIDESHOWS = crud('slideshow');

const slideshowPost = RequestLogger(
  {url: URL_API_SLIDESHOWS, method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const slideshowPatch = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Slideshow CRUD`.page`${URL_APP_AUTH_ADMIN}`.requestHooks([slideshowPost, slideshowPatch]);

test('Client create,view,edit slideshow', async t => {
  await t.navigateTo(URL_APP_SLIDESHOWS);
  await t.click(Selector('a.create-slideshow'));

  let location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_SLIDESHOWS}create`).ok('navigation to create slideshow ok');

  const slideshowName = 'test slideshow';
  await t
    .typeText('#slideshowNameField', slideshowName)
    .expect(Selector('#slideshowNameField').value)
    .eql(slideshowName);

  const shopName = 'test shop';
  await t
    .click(Selector('#shopSelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(shopName));

  const categoryName = 'test category';
  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(categoryName));

  await t.click(Selector('#designSelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(0));

  let speedChoosed = 4;
  const speedInput = Selector('input[name="slideshowSpeed"]');
  const track = Selector('.MuiSlider-track');
  await t.click(track).expect(speedInput.value).eql(speedChoosed.toString());

  const disablingCheckbox = Selector('#disablingCheckbox');
  await t.click(Selector(disablingCheckbox));

  await t.click("button[type='submit']");
  await t.expect(slideshowPost.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {id, name, speed, shop, disabled, categories, design},
  } = await JSON.parse(slideshowPost.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_SLIDESHOWS}view/${id}` &&
        name === slideshowName &&
        speed === speedChoosed &&
        shop.name === shopName &&
        categories[0].name === categoryName &&
        disabled === true &&
        !isEmpty(design),
    )
    .ok('navigation to view of created slideshow');

  await t.click('a.edit-slideshow');
  location = await ClientFunction(() => document.location.href)();
  await t.expect(location === `${URL_APP_SLIDESHOWS}edit/${id}`).ok('navigation to edit slideshow');

  const nameChanges = ' changed';
  await t.typeText('#slideshowNameField', nameChanges);

  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').nth(1));

  await t.click(Selector('#designSelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(1));

  speedChoosed = 5;
  await t.click(track, {offsetX: 30}).expect(speedInput.value).eql(speedChoosed.toString());

  await t.click(Selector(disablingCheckbox));

  await t.click("button[type='submit']");
  await t.expect(slideshowPatch.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {
      name: nameChanged,
      speed: speedChanged,
      disabled: disabledChanged,
      categories: categoriesUpdated,
      design: designChanged,
      empty,
    },
  } = await JSON.parse(slideshowPatch.requests[0].response.body);
  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_SLIDESHOWS}view/${id}`,
      nameChanged === slideshowName + nameChanges &&
        speedChanged === speedChoosed &&
        disabledChanged === false &&
        categoriesUpdated.length > categories.length &&
        empty &&
        designChanged.id !== design.id,
    )
    .ok('navigation to view of changed slideshow');
});

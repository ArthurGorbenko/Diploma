import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {URL_APP_AUTH_CLIENT, route, crud} from './config';

const URL_APP_SLIDESHOWS = crud('slideshow');
let slideId = null;
let slideshowId = null;

const postSlide = RequestLogger(
  {method: 'post'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const patchSlide = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

const deleteSlide = RequestLogger(
  {method: 'delete'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Slide CRUD`.page`${URL_APP_AUTH_CLIENT}`
  .requestHooks([postSlide, patchSlide, deleteSlide])
  .beforeEach(async t => {
    t.ctx.productName = 'test product changed';
    t.ctx.categoryName = 'test category1';
    t.ctx.textChange = ' changed';
    t.ctx.slideTitle = 'test title';
    t.ctx.price1 = '1';
    t.ctx.price1Detail = 'price1 details';
    t.ctx.price2 = '2';
    t.ctx.price2Detail = 'price2 details';
  });

test('test slide creation', async t => {
  await t.navigateTo(URL_APP_SLIDESHOWS);
  await t.click(Selector('td').withExactText('test slideshow changed')).click('.create-slide');

  await t
    .click(Selector('#categorySelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(t.ctx.categoryName));

  await t
    .click(Selector('#productSelect'))
    .click(Selector('.MuiAutocomplete-popper').find('li').withExactText(t.ctx.productName));

  await t
    .typeText('#price1', t.ctx.price1)
    .expect(Selector('#price1').value)
    .eql(t.ctx.price1 + '€');

  await t
    .typeText('#price1_detail', t.ctx.price1Detail)
    .expect(Selector('#price1_detail').value)
    .eql(t.ctx.price1Detail);

  await t
    .typeText('#price2', t.ctx.price2)
    .expect(Selector('#price2').value)
    .eql(t.ctx.price2 + '€');

  await t
    .typeText('#price2_detail', t.ctx.price2Detail)
    .expect(Selector('#price2_detail').value)
    .eql(t.ctx.price2Detail);

  await t
    .typeText('#slideTitleInput', t.ctx.slideTitle)
    .expect(Selector('#slideTitleInput').value)
    .eql(t.ctx.slideTitle);

  await t.click(Selector('#eventSelect')).click(Selector('.MuiList-root').find('li').nth(0));

  await t.click(Selector('#countrySelect')).click(Selector('.MuiAutocomplete-popper').find('li').nth(0));

  await t.click("button[type='submit']");

  await t.expect(postSlide.contains(({response: {statusCode}}) => statusCode < 202)).ok();

  const {
    data: {
      id,
      slide_data: {product, title, event, country, price1, price1_detail, price2, price2_detail, labels},
      slideshow_id,
    },
  } = await JSON.parse(postSlide.requests[0].response.body);

  slideId = id;
  slideshowId = slideshow_id;

  const location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_SLIDESHOWS}${slideshow_id}/slides/view/${id}` &&
        product.title === t.ctx.productName &&
        title === t.ctx.slideTitle &&
        !event &&
        !labels.length &&
        price1 === t.ctx.price1 + '€' &&
        price1_detail === t.ctx.price1Detail &&
        price2 === t.ctx.price2 + '€' &&
        price2_detail === t.ctx.price2Detail &&
        country,
    )
    .ok('navigation to view of created slide');
});

test('test slide edit', async t => {
  await t.navigateTo(`${URL_APP_SLIDESHOWS}${slideshowId}/slides/edit/${slideId}`);

  let location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_SLIDESHOWS}${slideshowId}/slides/edit/${slideId}`)
    .ok('navigation to create slideshow ok');

  await t
    .typeText('#price1', t.ctx.price1)
    .expect(Selector('#price1').value)
    .eql(t.ctx.price1 + t.ctx.price1 + '€');

  await t
    .typeText('#price1_detail', t.ctx.textChange)
    .expect(Selector('#price1_detail').value)
    .eql(t.ctx.price1Detail + t.ctx.textChange);

  await t
    .typeText('#price2', t.ctx.price2)
    .expect(Selector('#price2').value)
    .eql(t.ctx.price2 + t.ctx.price2 + '€');

  await t
    .typeText('#price2_detail', t.ctx.textChange)
    .expect(Selector('#price2_detail').value)
    .eql(t.ctx.price2Detail + t.ctx.textChange);

  await t
    .typeText('#slideTitleInput', t.ctx.textChange)
    .expect(Selector('#slideTitleInput').value)
    .eql(t.ctx.slideTitle + t.ctx.textChange);

  await t.click(Selector('#eventSelect')).click(Selector('.MuiList-root').find('li').nth(1));

  await t.click("button[type='submit']");

  await t.expect(patchSlide.contains(({response: {statusCode}}) => statusCode < 202)).ok();

  const {
    data: {
      id,
      slide_data: {title, event, country, price1, price1_detail, price2, price2_detail, labels},
      slideshow_id,
    },
  } = await JSON.parse(patchSlide.requests[0].response.body);

  location = await ClientFunction(() => document.location.href)();
  await t
    .expect(
      location === `${URL_APP_SLIDESHOWS}${slideshow_id}/slides/view/${id}` &&
        id === slideId &&
        slideshow_id === slideshowId &&
        title === t.ctx.slideTitle + t.ctx.textChange &&
        event &&
        !labels.length &&
        price1 === t.ctx.price1 + t.ctx.price1 + '€' &&
        price1_detail === t.ctx.price1Detail + t.ctx.textChange &&
        price2 === t.ctx.price2 + t.ctx.price2 + '€' &&
        price2_detail === t.ctx.price2Detail + t.ctx.textChange &&
        country,
    )
    .ok('navigation to view of edited slide');
});

test('test slide delete', async t => {
  await t
    .navigateTo(`${URL_APP_SLIDESHOWS}${slideshowId}/slides/view/${slideId}`)
    .click('.delete-slide')
    .click('.delete-confirm')
    .expect(deleteSlide.contains(({response: {statusCode}}) => statusCode < 202))
    .ok('server response ok');

  const {status} = await JSON.parse(deleteSlide.requests[0].response.body);
  await t.expect(status === 'ok').ok('slide deleted');
});

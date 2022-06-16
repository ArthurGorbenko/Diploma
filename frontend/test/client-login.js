import {Selector, ClientFunction} from 'testcafe';
import {URL_APP, SHOP_NAME, URL_APP_AUTH_CLIENT} from './config';

fixture`Client login`.page`${URL_APP}`;

test('login fail redirect to support', async t => {
  const location = await ClientFunction(() => document.location.href)();

  await t.expect(location === `${URL_APP}support`).ok('redirection to support ok');
});

test('Login with auth url', async t => {
  await t.navigateTo(URL_APP_AUTH_CLIENT);

  const location = await ClientFunction(() => document.location.href)();

  await t.expect(location === URL_APP).ok('redirection to home ok');
  await t.expect(Selector('header.MuiAppBar-root').exists).ok('Navbar exists');
  await t.expect(Selector('header .shopName').exists).ok('ShopName exists');

  const ShopNameText = await Selector('header .shopName').textContent;
  await t.expect(ShopNameText === SHOP_NAME).ok('ShopName is loaded');
});

test('Client navigate to Products', async t => {
  await t.navigateTo(URL_APP_AUTH_CLIENT);
  await t.click(Selector('.navBar a.products'));

  const location = await ClientFunction(() => document.location.href)();

  await t.expect(location === `${URL_APP}products`).ok('navigation to products ok');
});

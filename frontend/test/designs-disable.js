import {Selector, ClientFunction, RequestLogger} from 'testcafe';
import {route, crud, URL_APP_AUTH_ADMIN} from './config';

const URL_APP_DESIGNS = crud('designs');

const designsPatch = RequestLogger(
  {method: 'patch'},
  {
    stringifyResponseBody: true,
    logResponseBody: true,
  },
);

fixture`Designs : test disable option`.page`${URL_APP_AUTH_ADMIN}`.requestHooks([designsPatch]);

test('go to designs page', async t => {
  await t.navigateTo(URL_APP_DESIGNS);

  await t
    .click(Selector('.MuiTableRow-root').nth(1))
    .expect(Selector('[role="row"]').exists)
    .ok('List panel opened');

  const disableCheckbox = '#designsDisableCheckbox';
  const initialValue = await Selector(disableCheckbox).checked;
  await t.click(disableCheckbox).expect(Selector(disableCheckbox).checked).notEql(initialValue);

  await t.expect(designsPatch.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {disabled},
  } = await JSON.parse(designsPatch.requests[0].response.body);

  await t.expect(disabled !== initialValue).ok('Disabled status is changed');

  await t.click(disableCheckbox);

  await t.expect(designsPatch.contains(({response: {statusCode}}) => statusCode < 202)).ok();
  const {
    data: {disabled: disabledReverted},
  } = await JSON.parse(designsPatch.requests[1].response.body);

  await t
    .expect(disabledReverted === initialValue)
    .ok('Disabled status is reverted to an initial value.');
});

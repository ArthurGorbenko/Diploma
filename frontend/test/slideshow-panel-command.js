import {Selector, ClientFunction} from 'testcafe';
import {URL_APP, URL_APP_AUTH_CLIENT, URL_APP_AUTH_ADMIN, crud} from './config';

const URL_APP_SLIDESHOWS = crud('slideshow');

fixture`Slideshow command`.page`${URL_APP}`;

test('check slideshow panel and go to generate command page', async t => {
  await t.navigateTo(URL_APP_AUTH_ADMIN);
  await t.navigateTo(URL_APP_SLIDESHOWS);

  // get one list item
  const tableRow = Selector('.table-row').nth(0);
  await t.expect(tableRow.exists).ok('Slideshow list item exists');
  const id = await tableRow.id;

  // item details panel should not exist
  const tableRowPanel1 = tableRow.nextSibling('.MuiTableRow-root');
  await t.expect(tableRowPanel1.exists).ok('Slideshow list item panel does not exist');

  // click on list item to open panel
  await t.click(tableRow);

  // item details panel should exist
  const tableRowPanel2 = tableRow.nextSibling('.MuiTableRow-root');
  await t.expect(tableRowPanel2.exists).ok('Slideshow list item panel exists');

  const idPanel = await tableRowPanel2.id;

  await t.expect(id === idPanel.replace('panel-', '')).ok('item and panel have same id');

  // check generate command button
  const buttonCommand = Selector(`#${idPanel} .create-command`);
  await t.expect(buttonCommand.exists).ok('Generate command button exists');

  // click on button and check new url
  await t.click(buttonCommand);
  let location = await ClientFunction(() => document.location.href)();
  await t
    .expect(location === `${URL_APP_SLIDESHOWS}command/${id.replace('id-', '')}`)
    .ok('navigation to generate command ok');

  // TODO : very simple test on command form (write IP, check that commands appear)
});

test("Can't go to slideshow generate command page as client", async t => {
  await t.navigateTo(URL_APP_AUTH_CLIENT);
  await t.navigateTo(URL_APP_SLIDESHOWS);

  const tableRow = Selector('.table-row').nth(0);
  await t.click(tableRow);
  const tableRowPanel = tableRow.nextSibling('.MuiTableRow-root');

  // Generate command button should not exist
  const buttonCommand = Selector('.create-command');
  await t.expect(buttonCommand.exists).notOk('Generate command button exists');
});

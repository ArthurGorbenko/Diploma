const createTestCafe = require('testcafe');
const {exec} = require('child_process');
require('dotenv').config({path: '.env.local'});

let testcafe = null;
let runner = null;
const pathToBe = process.env.PATH_TO_BE_FOLDER;

let sql = "INSERT INTO category (id, name) VALUES (9999999, 'test category');";
sql +=
  "INSERT INTO shop (id,name, uuid, license, disabled, expiration_date, root) VALUES (9999999,'test root', 'test_root_uuid', 'test_root_license', 0, '2222-04-09', 1);";
sql +=
  "INSERT INTO shop (id,name, uuid, license, disabled, expiration_date, root) VALUES (9999998,'test shop', 'test_shop_uuid', 'test_shop_license', 0, '2222-04-09', 0);";
sql += 'INSERT INTO shop_category (shop_id, category_id) VALUES (9999998,9999999);';

const commandAdd = `${pathToBe}bin/console doctrine:query:sql "${sql}"`;

//insert test data in db
exec(commandAdd, (error, stdout, stderr) => {
  console.log(stdout, stderr);
});

let sql1 = 'DELETE FROM slideshow WHERE shop_id = 9999998;';
sql1 += 'DELETE FROM shop WHERE id = 9999999;';
sql1 += 'DELETE FROM shop WHERE id = 9999998;';

const commandDelete = `${pathToBe}bin/console doctrine:query:sql "${sql1}"`;

createTestCafe('localhost', 1344, 1342)
  .then(tc => {
    testcafe = tc;
    runner = testcafe.createRunner();

    return runner
      .src([
        'test/add-test-data.js',
        'test/category-crud.js',
        'test/client-login.js',
        'test/product-crud.js',
        'test/shop-crud.js',
        'test/slideshow-crud.js',
        'test/slide-crud.js',
        'test/slideshow-panel-command.js',
        'test/designs-disable.js',
        'test/delete-test-data.js',
      ])
      .browsers(['chrome'])
      .reporter('list')
      .run();
  })
  .then(failedCount => {
    console.log('Tests failed: ' + failedCount);
    testcafe.close();
  })
  .then(() => {
    exec(commandDelete, (error, stdout, stderr) => {
      console.log(stdout, stderr);
    });
  });

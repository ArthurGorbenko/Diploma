
## Add test data for testcafe
```

INSERT INTO `category` (`id`, `name`) VALUES (9999999, 'test category');

INSERT INTO `shop` (`id`,`name`, `uuid`, `license`, `disabled`, `expiration_date`, `root`) VALUES (9999999,'test root', 'test_root_uuid', 'test_root_license', 0, '2222-04-09', 1);

INSERT INTO `shop` (`id`,`name`, `uuid`, `license`, `disabled`, `expiration_date`, `root`) VALUES (9999998,'test shop', 'test_shop_uuid', 'test_shop_license', 0, '2222-04-09', 0);

INSERT INTO `shop_category` (`shop_id`, `category_id`) VALUES (9999998,9999999);


```
## Delete test data
```
DELETE FROM `slideshow` WHERE `shop_id` = 9999998;
DELETE FROM `shop` WHERE `id` = 9999999;
DELETE FROM `shop` WHERE `id` = 9999998;

```

## Run testcafe

- Copy `.evn.local.example` and set absolute path to `shop-slideshow` (backend) folder.

- `yarn tests`
<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200518134624 extends AbstractMigration
{
  public function getDescription(): string
  {
    return '';
  }

  public function up(Schema $schema): void
  {
    // this up() migration is auto-generated, please modify it to your needs
    $this->abortIf(
      $this->connection->getDatabasePlatform()->getName() !== 'mysql',
      'Migration can only be executed safely on \'mysql\'.'
    );

    $this->addSql('ALTER TABLE option_value CHANGE value value JSON NOT NULL');
    $this->addSql(
      'ALTER TABLE `option` CHANGE default_value default_value JSON NOT NULL, CHANGE supported_values supported_values JSON NOT NULL'
    );
    $this->addSql(
      'ALTER TABLE shop CHANGE logo logo VARCHAR(255) DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE slide_product CHANGE title title VARCHAR(255) DEFAULT NULL, CHANGE event event VARCHAR(255) DEFAULT NULL, CHANGE country country VARCHAR(255) DEFAULT NULL, CHANGE price1 price1 VARCHAR(255) DEFAULT NULL, CHANGE price1_detail price1_detail VARCHAR(255) DEFAULT NULL, CHANGE price2 price2 VARCHAR(255) DEFAULT NULL, CHANGE price2_detail price2_detail VARCHAR(255) DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE slideshow DROP transition, DROP font, CHANGE design_id design_id INT DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE product CHANGE shop_id shop_id INT DEFAULT NULL, CHANGE category_id category_id INT DEFAULT NULL'
    );
  }

  public function down(Schema $schema): void
  {
    // this down() migration is auto-generated, please modify it to your needs
    $this->abortIf(
      $this->connection->getDatabasePlatform()->getName() !== 'mysql',
      'Migration can only be executed safely on \'mysql\'.'
    );

    $this->addSql(
      'ALTER TABLE `option` CHANGE default_value default_value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`, CHANGE supported_values supported_values LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`'
    );
    $this->addSql(
      'ALTER TABLE option_value CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`'
    );
    $this->addSql(
      'ALTER TABLE product CHANGE shop_id shop_id INT DEFAULT NULL, CHANGE category_id category_id INT DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE shop CHANGE logo logo VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`'
    );
    $this->addSql(
      'ALTER TABLE slide_product CHANGE title title VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE event event VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE country country VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE price1 price1 VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE price1_detail price1_detail VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE price2 price2 VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE price2_detail price2_detail VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`'
    );
    $this->addSql(
      'ALTER TABLE slideshow ADD transition VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD font VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE design_id design_id INT DEFAULT NULL'
    );
  }
}

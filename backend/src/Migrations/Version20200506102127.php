<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200506102127 extends AbstractMigration
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

    $this->addSql(
      'CREATE TABLE `option` (id INT AUTO_INCREMENT NOT NULL, design_id INT NOT NULL, machine_name VARCHAR(255) NOT NULL, translation_id INT NOT NULL, target_entity VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, default_value VARCHAR(255) NOT NULL, disabled TINYINT(1) NOT NULL, INDEX IDX_5A8600B0E41DC9B2 (design_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB'
    );
    $this->addSql(
      'ALTER TABLE `option` ADD CONSTRAINT FK_5A8600B0E41DC9B2 FOREIGN KEY (design_id) REFERENCES design (id)'
    );
    $this->addSql(
      'ALTER TABLE shop CHANGE logo logo VARCHAR(255) DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE slide_product CHANGE title title VARCHAR(255) DEFAULT NULL, CHANGE event event VARCHAR(255) DEFAULT NULL, CHANGE country country VARCHAR(255) DEFAULT NULL, CHANGE price1 price1 VARCHAR(255) DEFAULT NULL, CHANGE price1_detail price1_detail VARCHAR(255) DEFAULT NULL, CHANGE price2 price2 VARCHAR(255) DEFAULT NULL, CHANGE price2_detail price2_detail VARCHAR(255) DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE slideshow CHANGE design_id design_id INT DEFAULT NULL'
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

    $this->addSql('DROP TABLE `option`');
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
      'ALTER TABLE slideshow CHANGE design_id design_id INT DEFAULT NULL'
    );
  }
}

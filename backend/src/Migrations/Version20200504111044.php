<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200504111044 extends AbstractMigration
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
      'CREATE TABLE product_design (product_id INT NOT NULL, design_id INT NOT NULL, INDEX IDX_AF331B944584665A (product_id), INDEX IDX_AF331B94E41DC9B2 (design_id), PRIMARY KEY(product_id, design_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB'
    );
    $this->addSql(
      'ALTER TABLE product_design ADD CONSTRAINT FK_AF331B944584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE'
    );
    $this->addSql(
      'ALTER TABLE product_design ADD CONSTRAINT FK_AF331B94E41DC9B2 FOREIGN KEY (design_id) REFERENCES design (id) ON DELETE CASCADE'
    );
    $this->addSql(
      'ALTER TABLE shop CHANGE logo logo VARCHAR(255) DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE slide_product CHANGE title title VARCHAR(255) DEFAULT NULL, CHANGE price price VARCHAR(255) DEFAULT NULL, CHANGE event event VARCHAR(255) DEFAULT NULL, CHANGE country country VARCHAR(255) DEFAULT NULL'
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

    $this->addSql('DROP TABLE product_design');
    $this->addSql(
      'ALTER TABLE product CHANGE shop_id shop_id INT DEFAULT NULL, CHANGE category_id category_id INT DEFAULT NULL'
    );
    $this->addSql(
      'ALTER TABLE shop CHANGE logo logo VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`'
    );
    $this->addSql(
      'ALTER TABLE slide_product CHANGE title title VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE price price VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE event event VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE country country VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`'
    );
  }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200427043847 extends AbstractMigration
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
      'CREATE TABLE shop_category (shop_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_DDF4E3574D16C4DD (shop_id), INDEX IDX_DDF4E35712469DE2 (category_id), PRIMARY KEY(shop_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB'
    );
    $this->addSql(
      'ALTER TABLE shop_category ADD CONSTRAINT FK_DDF4E3574D16C4DD FOREIGN KEY (shop_id) REFERENCES shop (id) ON DELETE CASCADE'
    );
    $this->addSql(
      'ALTER TABLE shop_category ADD CONSTRAINT FK_DDF4E35712469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE'
    );
    $this->addSql('ALTER TABLE shop DROP FOREIGN KEY FK_AC6A4CA212469DE2');
    $this->addSql('DROP INDEX IDX_AC6A4CA212469DE2 ON shop');
    $this->addSql('ALTER TABLE shop DROP category_id');
  }

  public function down(Schema $schema): void
  {
    // this down() migration is auto-generated, please modify it to your needs
    $this->abortIf(
      $this->connection->getDatabasePlatform()->getName() !== 'mysql',
      'Migration can only be executed safely on \'mysql\'.'
    );

    $this->addSql('DROP TABLE shop_category');
    $this->addSql('ALTER TABLE shop ADD category_id INT DEFAULT NULL');
    $this->addSql(
      'ALTER TABLE shop ADD CONSTRAINT FK_AC6A4CA212469DE2 FOREIGN KEY (category_id) REFERENCES category (id)'
    );
    $this->addSql('CREATE INDEX IDX_AC6A4CA212469DE2 ON shop (category_id)');
  }
}

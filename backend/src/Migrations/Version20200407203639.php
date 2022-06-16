<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200407203639 extends AbstractMigration
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
      'ALTER TABLE slide_product DROP FOREIGN KEY FK_25385A4DD5AFB87'
    );
    $this->addSql(
      'ALTER TABLE slide_product ADD CONSTRAINT FK_25385A4DD5AFB87 FOREIGN KEY (slide_id) REFERENCES slide (id) ON DELETE CASCADE'
    );
    $this->addSql('ALTER TABLE slide DROP FOREIGN KEY FK_72EFEE628B14E343');
    $this->addSql(
      'ALTER TABLE slide ADD CONSTRAINT FK_72EFEE628B14E343 FOREIGN KEY (slideshow_id) REFERENCES slideshow (id) ON DELETE CASCADE'
    );
    $this->addSql(
      'ALTER TABLE slide_image DROP FOREIGN KEY FK_44B4D27CDD5AFB87'
    );
    $this->addSql(
      'ALTER TABLE slide_image ADD CONSTRAINT FK_44B4D27CDD5AFB87 FOREIGN KEY (slide_id) REFERENCES slide (id) ON DELETE CASCADE'
    );
  }

  public function down(Schema $schema): void
  {
    // this down() migration is auto-generated, please modify it to your needs
    $this->abortIf(
      $this->connection->getDatabasePlatform()->getName() !== 'mysql',
      'Migration can only be executed safely on \'mysql\'.'
    );

    $this->addSql('ALTER TABLE slide DROP FOREIGN KEY FK_72EFEE628B14E343');
    $this->addSql(
      'ALTER TABLE slide ADD CONSTRAINT FK_72EFEE628B14E343 FOREIGN KEY (slideshow_id) REFERENCES slideshow (id)'
    );
    $this->addSql(
      'ALTER TABLE slide_image DROP FOREIGN KEY FK_44B4D27CDD5AFB87'
    );
    $this->addSql(
      'ALTER TABLE slide_image ADD CONSTRAINT FK_44B4D27CDD5AFB87 FOREIGN KEY (slide_id) REFERENCES slide (id)'
    );
    $this->addSql(
      'ALTER TABLE slide_product DROP FOREIGN KEY FK_25385A4DD5AFB87'
    );
    $this->addSql(
      'ALTER TABLE slide_product ADD CONSTRAINT FK_25385A4DD5AFB87 FOREIGN KEY (slide_id) REFERENCES slide (id)'
    );
  }
}

<?php

namespace App\Repository;

use App\Entity\Label;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Label|null find($id, $lockMode = null, $lockVersion = null)
 * @method Label|null findOneBy(array $criteria, array $orderBy = null)
 * @method Label[]    findAll()
 * @method Label[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LabelRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Label::class);
    $this->manager = $manager;
  }

  public function postLabel($name, $image_link, $category)
  {
    $newLabel = new Label();

    $newLabel
      ->setName($name)
      ->setImageLink($image_link)
      ->setCategory($category);

    $this->manager->persist($newLabel);
    $this->manager->flush();
    return $newLabel;
  }
  public function patchLabel(Label $label, $data)
  {
    empty($data['name']) ? true : $label->setName($data['name']);
    empty($data['image_link'])
      ? true
      : $label->setImageLink($data['image_link']);

    $this->manager->flush();
    return $label;
  }

  public function deleteLabel(Label $label)
  {
    $this->manager->remove($label);
    $this->manager->flush();
  }
  // /**
  //  * @return Label[] Returns an array of Label objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('l.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?Label
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

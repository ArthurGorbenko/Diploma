<?php

namespace App\Repository;

use App\Entity\Design;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Design|null find($id, $lockMode = null, $lockVersion = null)
 * @method Design|null findOneBy(array $criteria, array $orderBy = null)
 * @method Design[]    findAll()
 * @method Design[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DesignRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Design::class);

    $this->manager = $manager;
  }

  public function postDesign($machine_name, $parent, $disabled)
  {
    $newDesign = new Design();

    $newDesign
      ->setMachineName($machine_name)
      ->setDisabled(!empty($disabled))
      ->setParent($parent);

    $this->manager->persist($newDesign);
    $this->manager->flush();

    return $newDesign;
  }

  public function patchDesign(Design $design, $data)
  {
    !isset($data['disabled']) ? true : $design->setDisabled($data['disabled']);

    $this->manager->flush();

    return $design;
  }

  public function deleteDesign(Design $design)
  {
    $this->manager->remove($design);
    $this->manager->flush();
  }

  // /**
  //  * @return Design[] Returns an array of Design objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?Design
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

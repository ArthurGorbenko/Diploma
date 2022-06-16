<?php

namespace App\Repository;

use App\Entity\LicenseKey;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method LicenseKey|null find($id, $lockMode = null, $lockVersion = null)
 * @method LicenseKey|null findOneBy(array $criteria, array $orderBy = null)
 * @method LicenseKey[]    findAll()
 * @method LicenseKey[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LicenseKeyRepository extends ServiceEntityRepository
{
  public function __construct(ManagerRegistry $registry)
  {
    parent::__construct($registry, LicenseKey::class);
  }

  // /**
  //  * @return LicenseKey[] Returns an array of LicenseKey objects
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
    public function findOneBySomeField($value): ?LicenseKey
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

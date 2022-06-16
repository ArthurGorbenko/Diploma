<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Category|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category[]    findAll()
 * @method Category[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Category::class);
    $this->manager = $manager;
  }

  public function postCategory($name)
  {
    $newCategory = new Category();

    $newCategory->setName($name);

    $this->manager->persist($newCategory);
    $this->manager->flush();
    return $newCategory;
  }
  public function patchCategory(Category $category, $data)
  {
    empty($data['name']) ? true : $category->setName($data['name']);

    $this->manager->flush();
    return $category;
  }

  public function deleteCategory(Category $category)
  {
    $this->manager->remove($category);
    $this->manager->flush();
  }

  // /**
  //  * @return Category[] Returns an array of Category objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?Category
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

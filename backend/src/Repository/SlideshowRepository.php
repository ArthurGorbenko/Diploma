<?php

namespace App\Repository;

use App\Entity\Slideshow;
use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Slideshow|null find($id, $lockMode = null, $lockVersion = null)
 * @method Slideshow|null findOneBy(array $criteria, array $orderBy = null)
 * @method Slideshow[]    findAll()
 * @method Slideshow[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SlideshowRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Slideshow::class);
    $this->manager = $manager;
  }

  public function postSlideshow($name, $speed, $disabled, $shop, $design)
  {
    $newSlideshow = new Slideshow();

    $newSlideshow
      ->setName($name)
      ->setSpeed($speed)
      ->setDisabled($disabled)
      ->setVersion(0)
      ->setShop($shop)
      ->setDesign($design);

    $this->manager->persist($newSlideshow);
    $this->manager->flush();

    return $newSlideshow;
  }

  public function patchSlideshow(Slideshow $slideshow, $data)
  {
    empty($data['name']) ? true : $slideshow->setName($data['name']);
    empty($data['speed']) ? true : $slideshow->setSpeed($data['speed']);
    empty($data['design']) ? true : $slideshow->setDesign($data['design']);
    !isset($data['disabled'])
      ? true
      : $slideshow->setDisabled($data['disabled']);
    //empty($data['shop']) ? true : $slideshow->setShop($data['shop']);
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->flush();

    return $slideshow;
  }
  public function deleteSlideshow(Slideshow $slideshow)
  {
    $this->manager->remove($slideshow);
    $this->manager->flush();
  }

  public function postSlideshowCategory(
    Slideshow $slideshow,
    Category $category
  ) {
    $slideshow->addCategory($category);
    $this->manager->flush();
  }

  public function deleteSlideshowCategory(
    Slideshow $slideshow,
    Category $category
  ) {
    $slideshow->removeCategory($category);
    $this->manager->flush();
  }

  // /**
  //  * @return Slideshow[] Returns an array of Slideshow objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?Slideshow
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

<?php

namespace App\Repository;

use App\Entity\Slide;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Slide|null find($id, $lockMode = null, $lockVersion = null)
 * @method Slide|null findOneBy(array $criteria, array $orderBy = null)
 * @method Slide[]    findAll()
 * @method Slide[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SlideRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Slide::class);

    $this->manager = $manager;
  }

  public function postSlide($type, $slideshow, $number, $disabled)
  {
    $newSlide = new Slide();

    $newSlide
      ->setSlideshow($slideshow)
      ->setNumber($number)
      ->setType($type)
      ->setDisabled(!empty($disabled));

    $slideshow = $newSlide->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->persist($newSlide);
    $this->manager->flush();
    return $newSlide;
  }
  public function patchSlide(Slide $slide, $data)
  {
    //empty($data['type']) ? true : $slide->setType($data['type']);
    empty($data['number']) ? true : $slide->setNumber($data['number']);
    !isset($data['disabled']) ? true : $slide->setDisabled($data['disabled']);
    $slideshow = $slide->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->flush();
    return $slide;
  }

  public function deleteSlide(Slide $slide)
  {
    $slideshow = $slide->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);
    $this->manager->remove($slide);
    $this->manager->flush();
  }
  // /**
  //  * @return Slide[] Returns an array of Slide objects
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
    public function findOneBySomeField($value): ?Slide
    { return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

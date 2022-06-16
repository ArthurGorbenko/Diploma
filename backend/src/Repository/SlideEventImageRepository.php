<?php

namespace App\Repository;

use App\Entity\SlideEventImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method SlideEventImage|null find($id, $lockMode = null, $lockVersion = null)
 * @method SlideEventImage|null findOneBy(array $criteria, array $orderBy = null)
 * @method SlideEventImage[]    findAll()
 * @method SlideEventImage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SlideEventImageRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, SlideEventImage::class);
    $this->manager = $manager;
  }

  public function postSlideEventImage($eventImage, $slide)
  {
    $newSlideEventImage = new SlideEventImage();

    $newSlideEventImage->setSlide($slide)->setEventImage($eventImage);

    $slideshow = $newSlideEventImage->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->persist($newSlideEventImage);
    $this->manager->flush();
    return $newSlideEventImage;
  }
  public function patchSlideEventImage(SlideEventImage $slideEventImage, $data)
  {
    empty($data['eventImage'])
      ? true
      : $slideEventImage->setEventImage($data['eventImage']);

    $slideshow = $slideEventImage->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->flush();
    return $slideEventImage;
  }

  public function deleteSlideEventImage(SlideEventImage $slideEventImage)
  {
    $slideshow = $slideEventImage->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);
    $this->manager->remove($slideEventImage);
    $this->manager->flush();
  }
  // /**
  //  * @return SlideEventImage[] Returns an array of SlideEventImage objects
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
    public function findOneBySomeField($value): ?SlideEventImage
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

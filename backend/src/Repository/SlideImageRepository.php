<?php

namespace App\Repository;

use App\Entity\SlideImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method SlideImage|null find($id, $lockMode = null, $lockVersion = null)
 * @method SlideImage|null findOneBy(array $criteria, array $orderBy = null)
 * @method SlideImage[]    findAll()
 * @method SlideImage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SlideImageRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, SlideImage::class);
    $this->manager = $manager;
  }

  public function postSlideImage($image_link, $slide)
  {
    $newSlideImage = new SlideImage();

    $newSlideImage->setSlide($slide)->setImageLink($image_link);

    $slideshow = $newSlideImage->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->persist($newSlideImage);
    $this->manager->flush();
    return $newSlideImage;
  }
  public function patchSlideImage(SlideImage $slideImage, $data)
  {
    empty($data['image_link'])
      ? true
      : $slideImage->setImageLink($data['image_link']);

    $slideshow = $slideImage->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->flush();
    return $slideImage;
  }

  public function deleteSlideImage(SlideImage $slideImage)
  {
    $slideshow = $slideImage->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);
    $this->manager->remove($slideImage);
    $this->manager->flush();
  }
  // /**
  //  * @return SlideImage[] Returns an array of SlideImage objects
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
    public function findOneBySomeField($value): ?SlideImage
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

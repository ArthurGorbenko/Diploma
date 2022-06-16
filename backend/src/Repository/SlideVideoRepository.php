<?php

namespace App\Repository;

use App\Entity\SlideVideo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method SlideVideo|null find($id, $lockMode = null, $lockVersion = null)
 * @method SlideVideo|null findOneBy(array $criteria, array $orderBy = null)
 * @method SlideVideo[]    findAll()
 * @method SlideVideo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SlideVideoRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, SlideVideo::class);
    $this->manager = $manager;
  }

  public function postSlideVideo($video_link, $slide)
  {
    $newSlideVideo = new SlideVideo();

    $newSlideVideo->setSlide($slide)->setVideoLink($video_link);

    $slideshow = $newSlideVideo->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->persist($newSlideVideo);
    $this->manager->flush();
    return $newSlideVideo;
  }
  public function patchSlideVideo(SlideVideo $slideVideo, $data)
  {
    empty($data['video_link'])
      ? true
      : $slideVideo->setVideoLink($data['video_link']);

    $slideshow = $slideVideo->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->flush();
    return $slideVideo;
  }

  public function deleteSlideVideo(SlideVideo $slideVideo)
  {
    $slideshow = $slideVideo->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);
    $this->manager->remove($slideVideo);
    $this->manager->flush();
  }
  // /**
  //  * @return SlideVideo[] Returns an array of SlideVideo objects
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
    public function findOneBySomeField($value): ?SlideVideo
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

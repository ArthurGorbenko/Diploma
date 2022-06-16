<?php

namespace App\Repository;

use App\Entity\EventImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method EventImage|null find($id, $lockMode = null, $lockVersion = null)
 * @method EventImage|null findOneBy(array $criteria, array $orderBy = null)
 * @method EventImage[]    findAll()
 * @method EventImage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventImageRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, EventImage::class);
    $this->manager = $manager;
  }

  public function postEventImage($event, $image_link)
  {
    $newEventImage = new EventImage();

    $newEventImage->setEvent($event)->setImageLink($image_link);

    $this->manager->persist($newEventImage);
    $this->manager->flush();
    return $newEventImage;
  }
  public function patchEventImage(EventImage $eventImage, $data)
  {
    empty($data['image_link'])
      ? true
      : $eventImage->setImageLink($data['image_link']);

    $this->manager->flush();
    return $eventImage;
  }

  public function deleteEventImage(EventImage $eventImage)
  {
    $this->manager->remove($eventImage);
    $this->manager->flush();
  }

  // /**
  //  * @return EventImage[] Returns an array of EventImage objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?EventImage
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

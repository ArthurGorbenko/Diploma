<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Event|null find($id, $lockMode = null, $lockVersion = null)
 * @method Event|null findOneBy(array $criteria, array $orderBy = null)
 * @method Event[]    findAll()
 * @method Event[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Event::class);
    $this->manager = $manager;
  }

  public function postEvent($name)
  {
    $newEvent = new Event();

    $newEvent->setName($name);

    $this->manager->persist($newEvent);
    $this->manager->flush();
    return $newEvent;
  }
  public function patchEvent(Event $event, $data)
  {
    empty($data['name']) ? true : $event->setName($data['name']);

    $this->manager->flush();
    return $event;
  }

  public function deleteEvent(Event $event)
  {
    $this->manager->remove($event);
    $this->manager->flush();
  }

  // /**
  //  * @return Event[] Returns an array of Event objects
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
    public function findOneBySomeField($value): ?Event
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

<?php

namespace App\Repository;

use App\Entity\Option;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Option|null find($id, $lockMode = null, $lockVersion = null)
 * @method Option|null findOneBy(array $criteria, array $orderBy = null)
 * @method Option[]    findAll()
 * @method Option[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OptionRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Option::class);
    $this->manager = $manager;
  }

  public function postOption(
    $design,
    $machine_name,
    $translation_key,
    $target_entity,
    $type,
    $disabled,
    $default_value,
    $supported_values
  ) {
    $newOption = new Option();

    $newOption
      ->setMachineName($machine_name)
      ->setDisabled(!empty($disabled))
      ->setDesign($design)
      ->setTranslationKey($translation_key)
      ->setTargetEntity($target_entity)
      ->setType($type)
      ->setDefaultValue($default_value)
      ->setSupportedValues($supported_values);

    $this->manager->persist($newOption);
    $this->manager->flush();

    return $newOption;
  }

  public function patchOption(Option $option, $data)
  {
    !isset($data['translation_key'])
      ? true
      : $option->setTranslationKey($data['translation_key']);
    !isset($data['default_value'])
      ? true
      : $option->setDefaultValue($data['default_value']);
    !isset($data['supported_values'])
      ? true
      : $option->setSupportedValues($data['supported_values']);
    !isset($data['disabled']) ? true : $option->setDisabled($data['disabled']);
    $this->manager->flush();

    return $option;
  }

  public function deleteOption(Option $option)
  {
    $this->manager->remove($option);
    $this->manager->flush();
  }

  // /**
  //  * @return Option[] Returns an array of Option objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('o.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?Option
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

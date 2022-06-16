<?php

namespace App\Repository;

use App\Entity\OptionValue;
use App\Repository\OptionRepository;
use App\Repository\SlideshowRepository;
use App\Repository\ProductRepository;
use App\Repository\SlideRepository;
use App\Repository\SlideProductRepository;
use App\Repository\SlideImageRepository;
use App\Repository\SlideVideoRepository;
use App\Repository\SlideEventImageRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method OptionValue|null find($id, $lockMode = null, $lockVersion = null)
 * @method OptionValue|null findOneBy(array $criteria, array $orderBy = null)
 * @method OptionValue[]    findAll()
 * @method OptionValue[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OptionValueRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager,
    OptionRepository $optionRepository,
    SlideshowRepository $slideshowRepository,
    ProductRepository $productRepository,
    SlideRepository $slideRepository,
    SlideProductRepository $slideProductRepository,
    SlideImageRepository $slideImageRepository,
    SlideVideoRepository $slideVideoRepository,
    SlideEventImageRepository $slideEventImageRepository
  ) {
    parent::__construct($registry, OptionValue::class);
    $this->manager = $manager;
    $this->optionRepository = $optionRepository;
    $this->slideshowRepository = $slideshowRepository;
    $this->slideRepository = $slideRepository;
    $this->productRepository = $productRepository;
    $this->slideProductRepository = $slideProductRepository;
    $this->slideImageRepository = $slideImageRepository;
    $this->slideVideoRepository = $slideVideoRepository;
    $this->slideEventImageRepository = $slideEventImageRepository;
  }

  public function rewriteOptionValues(
    $target_entity_type,
    $target_entity_id,
    $design_ids,
    $option_values_data
  ) {
    $option_values = $this->findBy([
      'target_entity_id' => $target_entity_id,
      'target_entity_type' => $target_entity_type
    ]);

    $legacy_values = [];
    foreach ($option_values as $option_value) {
      if ($option_value->getReferredOption()->getType() === 'select') {
        if (
          !in_array(
            $option_value->getValue()[0],
            $option_value->getReferredOption()->getSupportedValues()
          )
        ) {
          $legacy_values[
            $option_value->getReferredOption()->getId()
          ] = $option_value->getValue();
        }
      }

      if ($option_value->getReferredOption()->getType() === 'multi_select') {
        foreach ($option_value->getValue()[0] as $value) {
          if (
            !in_array(
              $value,
              $option_value->getReferredOption()->getSupportedValues()
            )
          ) {
            $legacy_values[
              $option_value->getReferredOption()->getId()
            ][] = $value;
          }
        }
      }
      $this->deleteOptionValue($option_value);
    }

    foreach ($option_values_data as $option_value_data) {
      $option = $this->optionRepository->find($option_value_data['option_id']);

      // check if option exists
      if (empty($option)) {
        continue;
      }

      // check if option exists
      if ($option->getDisabled()) {
        continue;
      }

      // check if target entity has that option
      if (!in_array($option->getDesign()->getId(), $design_ids)) {
        continue;
      }

      // check if option's target entity matches the target entity
      if ($target_entity_type !== $option->getTargetEntity()) {
        continue;
      }

      // check if the value's type is correct
      switch ($option->getType()) {
        case 'multi_select':
          $expected_type = 'array';
          break;
        case 'select':
        case 'image_link':
        case 'video_link':
          $expected_type = 'string';
          break;
        default:
          $expected_type = $option->getType();
      }
      if (gettype($option_value_data['value']) !== $expected_type) {
        continue;
      }

      // check if value is supported
      if (
        $option->getType() === 'select' &&
        !in_array(
          $option_value_data['value'],
          array_merge(
            $option->getSupportedValues(),
            array_key_exists($option->getId(), $legacy_values)
              ? $legacy_values[$option->getId()]
              : []
          )
        )
      ) {
        continue;
      }

      // check if values are supported
      if ($option->getType() === 'multi_select') {
        foreach ($option_value_data['value'] as $value) {
          if (
            !in_array(
              $value,
              array_merge(
                $option->getSupportedValues(),
                array_key_exists($option->getId(), $legacy_values)
                  ? $legacy_values[$option->getId()]
                  : []
              )
            )
          ) {
            continue 2;
          }
        }
      }

      $this->postOptionValue(
        $option,
        $target_entity_type,
        $target_entity_id,
        $option_value_data['value']
      );

      // increment version for slideshow
      switch ($target_entity_type) {
        case 'slideshow':
          $slideshow = $this->slideshowRepository->find($target_entity_id);
          break;
        case 'slide':
          $slideshow = $this->slideRepository
            ->find($target_entity_id)
            ->getSlideshow();
          break;
        case 'slide_image':
          $slideshow = $this->slideImageRepository
            ->find($target_entity_id)
            ->getSlide()
            ->getSlideshow();
          break;
        case 'slide_video':
          $slideshow = $this->slideVideoRepository
            ->find($target_entity_id)
            ->getSlide()
            ->getSlideshow();
          break;
        case 'slide_event_image':
          $slideshow = $this->slideEventImageRepository
            ->find($target_entity_id)
            ->getSlide()
            ->getSlideshow();
          break;
        case 'slide_product':
          $slideshow = $this->slideProductRepository
            ->find($target_entity_id)
            ->getSlide()
            ->getSlideshow();
          break;
        case 'product':
          $slideProducts = $this->slideProductRepository->findBy([
            'product' => $target_entity_id
          ]);
          foreach ($slideProducts as $slideProduct) {
            $slideshow = $slideProduct->getSlide()->getSlideshow();
            $slideshow->setVersion($slideshow->getVersion() + 1);
          }
      }

      if (!empty($slideshow)) {
        $slideshow->setVersion($slideshow->getVersion() + 1);
      }
    }
  }

  public function getOptionValuesForEntity(
    $target_entity_type,
    $target_entity_id
  ) {
    $option_values = $this->findBy([
      'target_entity_id' => $target_entity_id,
      'target_entity_type' => $target_entity_type
    ]);
    $option_values_data = [];
    foreach ($option_values as $option_value) {
      $option_values_data[] = [
        'option_id' => $option_value->getReferredOption()->getId(),
        'value' => $option_value->getValue()[0]
      ];
    }
    return $option_values_data;
  }

  public function getOptionsForRender(
    $target_entity_type,
    $target_entity_id,
    $slideshow
  ) {
    $design = $slideshow->getDesign();

    $option_values = $this->findBy([
      'target_entity_id' => $target_entity_id,
      'target_entity_type' => $target_entity_type
    ]);
    $option_values_data = [];
    foreach ($option_values as $option_value) {
      $option_values_data[
        $option_value->getReferredOption()->getMachineName()
      ] = [
        'option_id' => $option_value->getReferredOption()->getId(),
        'machine_name' => $option_value->getReferredOption()->getMachineName(),
        'value' => $option_value->getValue()[0]
      ];
    }

    $option_ids_with_set_value = array_column($option_values_data, 'option_id');
    foreach ($design->getOptions() as $option) {
      if ($option->getTargetEntity() !== $target_entity_type) {
        continue;
      }
      if (!in_array($option->getId(), $option_ids_with_set_value)) {
        $option_values_data[$option->getMachineName()] = [
          'option_id' => $option->getId(),
          'machine_name' => $option->getMachineName(),
          'value' => $this->getDefaultValueWithOverwrite($option, $slideshow)
        ];
      }
    }

    $output = [];
    foreach ($option_values_data as $item) {
      $output[$item['machine_name']] = $item['value'];
    }

    //return $option_values_data;
    return $output;
  }

  public function getDefaultValueWithOverwrite($option, $slideshow)
  {
    if (empty($slideshow)) {
      return $option->getDefaultValue()[0];
    }

    $target_entity = $option->getTargetEntity();
    $machine_name = $option->getMachineName();
    $overwriteOption = $this->optionRepository->findOneBy([
      'machine_name' => "overwrite.$target_entity.$machine_name",
      'design' => $slideshow->getDesign()
    ]);

    if (!empty($overwriteOption)) {
      $overwriteOptionValue = $this->findOneBy([
        'referred_option' => $overwriteOption->getId(),
        'target_entity_id' => $slideshow->getId()
      ]);
      if (!empty($overwriteOptionValue)) {
        return $overwriteOptionValue->getValue()[0];
      } else {
        return $option->getDefaultValue()[0];
      }
    } else {
      return $option->getDefaultValue()[0];
    }
  }

  public function postOptionValue(
    $referred_option,
    $target_entity_type,
    $target_entity_id,
    $value
  ) {
    $newOptionValue = new OptionValue();

    $newOptionValue
      ->setReferredOption($referred_option)
      ->setTargetEntityType($target_entity_type)
      ->setTargetEntityId($target_entity_id)
      ->setValue([$value]);

    $this->manager->persist($newOptionValue);
    $this->manager->flush();

    return $newOptionValue;
  }

  //public function patchOptionValue(OptionValue $optionValue, $data)
  //{
  //  !isset($data['referred_option'])
  //    ? true
  //    : $optionValue->setReferredOption($data['referred_option']);
  //  !isset($data['target_entity_type'])
  //    ? true
  //    : $optionValue->setTargetEntityType($data['target_entity_type']);
  //  !isset($data['target_entity_id'])
  //    ? true
  //    : $optionValue->setTargetEntityId($data['target_entity_id']);
  //  !isset($data['value']) ? true : $optionValue->setValue($data['value']);
  //  $this->manager->flush();

  //  return $optionValue;
  //}

  public function deleteOptionValue(OptionValue $optionValue)
  {
    $this->manager->remove($optionValue);
    $this->manager->flush();
  }

  // /**
  //  * @return OptionValue[] Returns an array of OptionValue objects
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
    public function findOneBySomeField($value): ?OptionValue
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

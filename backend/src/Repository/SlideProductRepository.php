<?php

namespace App\Repository;

use App\Entity\SlideProduct;
use App\Entity\Label;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method SlideProduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method SlideProduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method SlideProduct[]    findAll()
 * @method SlideProduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SlideProductRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, SlideProduct::class);
    $this->manager = $manager;
  }

  public function postSlideProduct(
    $product,
    $title,
    $price1,
    $price1_detail,
    $price2,
    $price2_detail,
    $event,
    $country,
    $slide
  ) {
    $newSlideProduct = new SlideProduct();

    $newSlideProduct->setSlide($slide)->setProduct($product);
    !empty($title) ? $newSlideProduct->setTitle($title) : true;
    !empty($price1) ? $newSlideProduct->setPrice1($price1) : true;
    !empty($price1_detail)
      ? $newSlideProduct->setPrice1Detail($price1_detail)
      : true;
    !empty($price2) ? $newSlideProduct->setPrice2($price2) : true;
    !empty($price2_detail)
      ? $newSlideProduct->setPrice2Detail($price2_detail)
      : true;
    !empty($event) ? $newSlideProduct->setEvent($event) : true;
    !empty($country) ? $newSlideProduct->setCountry($country) : true;

    $slideshow = $newSlideProduct->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->persist($newSlideProduct);
    $this->manager->flush();
    return $newSlideProduct;
  }
  public function patchSlideProduct(SlideProduct $slideProduct, $data)
  {
    !isset($data['title']) ? true : $slideProduct->setTitle($data['title']);
    !isset($data['price1']) ? true : $slideProduct->setPrice1($data['price1']);
    !isset($data['price1_detail'])
      ? true
      : $slideProduct->setPrice1Detail($data['price1_detail']);
    !isset($data['price2']) ? true : $slideProduct->setPrice2($data['price2']);
    !isset($data['price2_detail'])
      ? true
      : $slideProduct->setPrice2Detail($data['price2_detail']);
    !isset($data['event']) ? true : $slideProduct->setEvent($data['event']);
    !isset($data['country'])
      ? true
      : $slideProduct->setCountry($data['country']);

    empty($data['product'])
      ? true
      : $slideProduct->setProduct($data['product']);

    $slideshow = $slideProduct->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->flush();
    return $slideProduct;
  }

  public function deleteSlideProduct(SlideProduct $slideProduct)
  {
    $slideshow = $slideProduct->getSlide()->getSlideshow();
    $slideshow->setVersion($slideshow->getVersion() + 1);

    $this->manager->remove($slideProduct);
    $this->manager->flush();
  }

  public function postSlideProductLabel(
    SlideProduct $slideProduct,
    Label $label
  ) {
    $slideProduct->addLabel($label);
    $this->manager->flush();
  }

  public function deleteSlideProductLabel(
    SlideProduct $slideProduct,
    Label $label
  ) {
    $slideProduct->removeLabel($label);
    $this->manager->flush();
  }

  // /**
  //  * @return SlideProduct[] Returns an array of SlideProduct objects
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
    public function findOneBySomeField($value): ?SlideProduct
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

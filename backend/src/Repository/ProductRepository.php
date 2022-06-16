<?php

namespace App\Repository;

use App\Entity\Design;
use App\Entity\Product;
use App\Repository\SlideProductRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager,
    SlideProductRepository $slideProductRepository
  ) {
    parent::__construct($registry, Product::class);
    $this->manager = $manager;
    $this->slideProductRepository = $slideProductRepository;
  }

  public function postProduct(
    $title,
    $media_type,
    $media_link,
    $shop,
    $category
  ) {
    $newProduct = new Product();

    $newProduct->setTitle($title);
    $newProduct->setMediaType($media_type);
    $newProduct->setMediaLink($media_link);
    $newProduct->setCategory($category);
    $newProduct->setShop($shop);

    $this->manager->persist($newProduct);
    $this->manager->flush();
    return $newProduct;
  }
  public function patchProduct(Product $product, $data)
  {
    empty($data['title']) ? true : $product->setTitle($data['title']);
    empty($data['media_type'])
      ? true
      : $product->setMediaType($data['media_type']);
    empty($data['media_link'])
      ? true
      : $product->setMediaLink($data['media_link']);

    empty($data['shop']) ? true : $product->setShop($data['shop']);
    empty($data['category']) ? true : $product->setCategory($data['category']);

    $slideProducts = $this->slideProductRepository->findBy([
      'product' => $product->getId()
    ]);
    foreach ($slideProducts as $slideProduct) {
      $slideshow = $slideProduct->getSlide()->getSlideshow();
      $slideshow->setVersion($slideshow->getVersion() + 1);
    }

    $this->manager->flush();
    return $product;
  }

  public function deleteProduct(Product $product)
  {
    $this->manager->remove($product);
    $this->manager->flush();
  }

  public function postProductDesign(Product $product, Design $design)
  {
    $product->addDesign($design);
    $this->manager->flush();
  }

  public function deleteProductDesign(Product $product, Design $design)
  {
    $product->removeDesign($design);
    $this->manager->flush();
  }

  // /**
  //  * @return Product[] Returns an array of Product objects
  //  */
  /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

  /*
    public function findOneBySomeField($value): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

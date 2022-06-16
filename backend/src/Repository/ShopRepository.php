<?php

namespace App\Repository;

use App\Entity\Shop;
use App\Entity\Category;
use App\Entity\Design;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Shop|null find($id, $lockMode = null, $lockVersion = null)
 * @method Shop|null findOneBy(array $criteria, array $orderBy = null)
 * @method Shop[]    findAll()
 * @method Shop[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShopRepository extends ServiceEntityRepository
{
  private $manager;
  public function __construct(
    ManagerRegistry $registry,
    EntityManagerInterface $manager
  ) {
    parent::__construct($registry, Shop::class);
    $this->manager = $manager;
  }
  public function postShop(
    $name,
    $logo,
    $uuid,
    $license,
    $disabled,
    $expiration_date,
    $email,
    $address,
    $phone,
    $owner_first_name,
    $owner_last_name,
    $owner_phone,
    $payment_frequency,
    $pin,
    $subscription_date
  ) {
    $newShop = new Shop();

    $newShop
      ->setName($name)
      ->setLogo($logo)
      ->setUuid($uuid)
      ->setLicense($license)
      ->setDisabled(!empty($disabled))
      ->setExpirationDate($expiration_date)
      ->setEmail($email)
      ->setAddress($address)
      ->setPhone($phone)
      ->setOwnerFirstName($owner_first_name)
      ->setOwnerLastName($owner_last_name)
      ->setOwnerPhone($owner_phone)
      ->setPaymentFrequency($payment_frequency)
      ->setPin($pin)
      ->setSubscriptionDate($subscription_date)
      ->setRoot(0);

    $this->manager->persist($newShop);
    $this->manager->flush();

    return $newShop;
  }

  public function patchShop(Shop $shop, $data)
  {
    empty($data['name']) ? true : $shop->setName($data['name']);
    !isset($data['logo']) ? true : $shop->setLogo($data['logo']);
    //empty($data['uuid']) ? true : $shop->setUuid($data['uuid']);
    empty($data['license']) ? true : $shop->setLicense($data['license']);
    !isset($data['disabled']) ? true : $shop->setDisabled($data['disabled']);
    empty($data['expiration_date'])
      ? true
      : $shop->setExpirationDate($data['expiration_date']);
    empty($data['subscription_date'])
      ? true
      : $shop->setSubscriptionDate($data['subscription_date']);
    empty($data['email']) ? true : $shop->setEmail($data['email']);
    empty($data['address']) ? true : $shop->setAddress($data['address']);
    empty($data['phone']) ? true : $shop->setPhone($data['phone']);
    empty($data['owner_first_name'])
      ? true
      : $shop->setOwnerFirstName($data['owner_first_name']);
    empty($data['owner_last_name'])
      ? true
      : $shop->setOwnerLastName($data['owner_last_name']);
    empty($data['owner_phone'])
      ? true
      : $shop->setOwnerPhone($data['owner_phone']);
    empty($data['payment_frequency'])
      ? true
      : $shop->setPaymentFrequency($data['payment_frequency']);
    empty($data['pin']) ? true : $shop->setPin($data['pin']);

    $this->manager->flush();

    return $shop;
  }
  public function deleteShop(Shop $shop)
  {
    $this->manager->remove($shop);
    $this->manager->flush();
  }

  public function postShopCategory(Shop $shop, Category $category)
  {
    $shop->addCategory($category);
    $this->manager->flush();
  }

  public function postShopDesign(Shop $shop, Design $design)
  {
    $shop->addDesign($design);
    $this->manager->flush();
  }

  public function deleteShopDesign(Shop $shop, Design $design)
  {
    $shop->removeDesign($design);
    $this->manager->flush();
  }

  // /**
  //  * @return Shop[] Returns an array of Shop objects
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
    public function findOneBySomeField($value): ?Shop
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

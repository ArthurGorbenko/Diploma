<?php

namespace App\Controller;

use App\Repository\ShopRepository;
use App\Repository\CategoryRepository;
use App\Repository\SlideshowRepository;
use App\Repository\LabelRepository;
use App\Repository\DesignRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;
use Ramsey\Uuid\Uuid;
use Doctrine\DBAL\DBALException;

/**
 * Class ShopController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/shops")
 */
class ShopController extends BaseController
{
  public function __construct(
    ShopRepository $shopRepository,
    SlideshowRepository $slideshowRepository,
    LabelRepository $labelRepository,
    DesignRepository $designRepository,
    CategoryRepository $categoryRepository
  ) {
    $this->shopRepository = $shopRepository;
    $this->slideshowRepository = $slideshowRepository;
    $this->labelRepository = $labelRepository;
    $this->designRepository = $designRepository;
    $this->categoryRepository = $categoryRepository;
  }

  /**
   * @Route("", name="post_shop", methods={"POST"})
   */
  public function postShop($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $data = json_decode($request->getContent(), true);

      $logo = !empty($data['logo']) ? $data['logo'] : '';
      $uuid = Uuid::uuid4()->toString();

      $categories = [];
      if (array_key_exists('category_ids', $data)) {
        foreach ($data['category_ids'] as $category_id) {
          $categories[] = $this->categoryRepository->findOneBy([
            'id' => $category_id
          ]);
        }
      }

      if (
        empty($data['name']) ||
        empty($uuid) ||
        empty($data['license']) ||
        empty($categories) ||
        !array_key_exists('disabled', $data) ||
        empty($data['expiration_date'])
      ) {
        throw new Exception('not enough data');
      }

      $name = $data['name'];
      $license = $data['license'];
      $disabled = $data['disabled'];
      $expiration_date = \DateTime::createFromFormat(
        'Y-m-d',
        $data['expiration_date']
      );

      $subscription_date = !empty($data['subscription_date'])
        ? \DateTime::createFromFormat('Y-m-d', $data['subscription_date'])
        : null;

      $email = $data['email'] ?? '';
      $address = $data['address'] ?? '';
      $phone = $data['phone'] ?? '';
      $owner_first_name = $data['owner_first_name'] ?? '';
      $owner_last_name = $data['owner_last_name'] ?? '';
      $owner_phone = $data['owner_phone'] ?? '';
      $payment_frequency = $data['payment_frequency'] ?? '';
      $pin = $data['pin'] ?? 1234;

      $shop = $this->shopRepository->postShop(
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
      );

      foreach ($categories as $category) {
        if (!empty($category)) {
          $this->shopRepository->postShopCategory($shop, $category);
        }
      }

      $designs = [];
      if (array_key_exists('design_ids', $data)) {
        foreach ($data['design_ids'] as $design_id) {
          $designs[] = $this->designRepository->findOneBy([
            'id' => $design_id
          ]);
        }
      }

      foreach ($designs as $design) {
        if (!empty($design)) {
          $this->shopRepository->postShopDesign($shop, $design);
        }
      }

      $designs_data = [];
      foreach ($shop->getDesigns() as $design) {
        $designs_data[] = [
          'id' => $design->getId(),
          'machine_name' => $design->getMachineName(),
          'disabled' => $design->getDisabled()
        ];
      }

      $categories_data = [];
      foreach ($shop->getCategories() as $category) {
        $labels_data = [];
        foreach (
          $this->labelRepository->findBy(['category' => $category->getId()])
          as $label
        ) {
          $labels_data[] = [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
          ];
        }
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName(),
          'labels' => $labels_data
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $shop->getId(),
            'name' => $shop->getName(),
            'logo' => $shop->getLogo(),
            'uuid' => $shop->getUuid(),
            'license' => $shop->getLicense(),
            'email' => $shop->getEmail(),
            'address' => $shop->getAddress(),
            'phone' => $shop->getPhone(),
            'owner_first_name' => $shop->getOwnerFirstName(),
            'owner_last_name' => $shop->getOwnerLastName(),
            'owner_phone' => $shop->getOwnerPhone(),
            'payment_frequency' => $shop->getPaymentFrequency(),
            'pin' => $shop->getPin(),
            'disabled' => $shop->getDisabled(),
            'expiration_date' => $shop->getExpirationDate()->format('Y-m-d'),
            'subscription_date' => $shop->getSubscriptionDate()
              ? $shop->getSubscriptionDate()->format('Y-m-d')
              : null,
            'root' => $shop->getRoot(),
            'categories' => $categories_data,
            'designs' => $designs_data
          ]
        ],
        Response::HTTP_CREATED
      );
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("", name="get_shops", methods={"GET"})
   */
  public function getAllShops($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $shops = $this->shopRepository->findAll();
      } else {
        $shops = [$this->shop];
      }
      $data = [];

      foreach ($shops as $shop) {
        $designs_data = [];
        foreach ($shop->getDesigns() as $design) {
          $designs_data[] = [
            'id' => $design->getId(),
            'machine_name' => $design->getMachineName(),
            'disabled' => $design->getDisabled()
          ];
        }
        $categories_data = [];
        foreach ($shop->getCategories() as $category) {
          $labels_data = [];
          foreach (
            $this->labelRepository->findBy(['category' => $category->getId()])
            as $label
          ) {
            $labels_data[] = [
              'id' => $label->getId(),
              'name' => $label->getName(),
              'image_link' => $label->getImageLink(),
              'category_id' => $category->getId()
            ];
          }
          $categories_data[] = [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'labels' => $labels_data
          ];
        }
        $data[] = [
          'id' => $shop->getId(),
          'name' => $shop->getName(),
          'logo' => $shop->getLogo(),
          'uuid' => $shop->getUuid(),
          'license' => $shop->getLicense(),
          'email' => $shop->getEmail(),
          'address' => $shop->getAddress(),
          'phone' => $shop->getPhone(),
          'owner_first_name' => $shop->getOwnerFirstName(),
          'owner_last_name' => $shop->getOwnerLastName(),
          'owner_phone' => $shop->getOwnerPhone(),
          'payment_frequency' => $shop->getPaymentFrequency(),
          'pin' => $shop->getPin(),
          'disabled' => $shop->getDisabled(),
          'expiration_date' => $shop->getExpirationDate()->format('Y-m-d'),
          'subscription_date' => $shop->getSubscriptionDate()
            ? $shop->getSubscriptionDate()->format('Y-m-d')
            : null,
          'root' => $shop->getRoot(),
          'categories' => $categories_data,
          'designs' => $designs_data
        ];
      }
      $page = $request->query->get('page', 1);
      return new JsonResponse(
        array_merge($this->paginateData($data, $page), ['status' => 'ok']),
        Response::HTTP_OK
      );
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("/current", name="get_current_shop", methods={"GET"})
   */
  public function getCurrentShop(
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);
      $shop = $this->shop;

      $designs_data = [];
      foreach ($shop->getDesigns() as $design) {
        $designs_data[] = [
          'id' => $design->getId(),
          'machine_name' => $design->getMachineName(),
          'disabled' => $design->getDisabled()
        ];
      }
      $available_designs_data = $designs_data;
      foreach ($this->designRepository->findAll() as $design) {
        if (count($design->getShops()) === 0) {
          $available_designs_data[] = [
            'id' => $design->getId(),
            'machine_name' => $design->getMachineName(),
            'disabled' => $design->getDisabled()
          ];
        }
      }

      $categories_data = [];
      foreach ($shop->getCategories() as $category) {
        $labels_data = [];
        foreach (
          $this->labelRepository->findBy(['category' => $category->getId()])
          as $label
        ) {
          $labels_data[] = [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
          ];
        }
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName(),
          'labels' => $labels_data
        ];
      }

      $data[] = [
        'id' => $shop->getId(),
        'name' => $shop->getName(),
        'logo' => $shop->getLogo(),
        'uuid' => $shop->getUuid(),
        'license' => $shop->getLicense(),

        'email' => $shop->getEmail(),
        'address' => $shop->getAddress(),
        'phone' => $shop->getPhone(),
        'owner_first_name' => $shop->getOwnerFirstName(),
        'owner_last_name' => $shop->getOwnerLastName(),
        'owner_phone' => $shop->getOwnerPhone(),
        'payment_frequency' => $shop->getPaymentFrequency(),
        'pin' => $shop->getPin(),
        'disabled' => $shop->getDisabled(),
        'expiration_date' => $shop->getExpirationDate()->format('Y-m-d'),
        'subscription_date' => $shop->getSubscriptionDate()
          ? $shop->getSubscriptionDate()->format('Y-m-d')
          : null,
        'root' => $shop->getRoot(),
        'categories' => $categories_data,
        'designs' => $designs_data,
        'available_designs' => $available_designs_data
      ];
      return new JsonResponse(
        ['data' => $data, 'status' => 'ok'],
        Response::HTTP_OK
      );
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("/{id}", name="get_shop", methods={"GET"})
   */
  public function getShop($id, $uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }

      $shop = $this->shopRepository->findOneBy(['id' => $id]);

      if (empty($shop)) {
        throw new Exception('not found');
      }

      $designs_data = [];
      foreach ($shop->getDesigns() as $design) {
        $designs_data[] = [
          'id' => $design->getId(),
          'machine_name' => $design->getMachineName(),
          'disabled' => $design->getDisabled()
        ];
      }

      $categories_data = [];
      foreach ($shop->getCategories() as $category) {
        $labels_data = [];
        foreach (
          $this->labelRepository->findBy(['category' => $category->getId()])
          as $label
        ) {
          $labels_data[] = [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
          ];
        }
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName(),
          'labels' => $labels_data
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $shop->getId(),
            'name' => $shop->getName(),
            'logo' => $shop->getLogo(),
            'uuid' => $shop->getUuid(),
            'license' => $shop->getLicense(),

            'email' => $shop->getEmail(),
            'address' => $shop->getAddress(),
            'phone' => $shop->getPhone(),
            'owner_first_name' => $shop->getOwnerFirstName(),
            'owner_last_name' => $shop->getOwnerLastName(),
            'owner_phone' => $shop->getOwnerPhone(),
            'payment_frequency' => $shop->getPaymentFrequency(),
            'pin' => $shop->getPin(),
            'disabled' => $shop->getDisabled(),
            'expiration_date' => $shop->getExpirationDate()->format('Y-m-d'),
            'subscription_date' => $shop->getSubscriptionDate()
              ? $shop->getSubscriptionDate()->format('Y-m-d')
              : null,
            'root' => $shop->getRoot(),
            'categories' => $categories_data,
            'designs' => $designs_data
          ]
        ],
        Response::HTTP_OK
      );
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("/{id}", name="patch_shop", methods={"PATCH"})
   */
  public function patchShop(
    $uuid,
    $license,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }

      $shop = $this->shopRepository->findOneBy(['id' => $id]);
      if ($shop->getRoot()) {
        throw new Exception('no access');
      }

      if (empty($shop)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      if (!empty($data['expiration_date'])) {
        $data['expiration_date'] = \DateTime::createFromFormat(
          'Y-m-d',
          $data['expiration_date']
        );
      }

      if (!empty($data['subscription_date'])) {
        $data['subscription_date'] = \DateTime::createFromFormat(
          'Y-m-d',
          $data['subscription_date']
        );
      }

      if (array_key_exists('logo', $data)) {
        if ($data['logo'] === null) {
          $data['logo'] = '';
        }
      }

      $shop = $this->shopRepository->patchShop($shop, $data);

      $designs = [];
      if (array_key_exists('design_ids', $data)) {
        foreach ($shop->getDesigns() as $design) {
          $this->shopRepository->deleteShopDesign($shop, $design);
        }
        foreach ($data['design_ids'] as $design_id) {
          $design = $this->designRepository->findOneBy([
            'id' => $design_id
          ]);
          if (!empty($design)) {
            $this->shopRepository->postShopDesign($shop, $design);
          }
        }
      }

      if (array_key_exists('category_ids', $data)) {
        foreach ($data['category_ids'] as $category_id) {
          $category = $this->categoryRepository->findOneBy([
            'id' => $category_id
          ]);
          if (empty($category)) {
            continue;
          }
          $category_is_set = false;
          foreach ($shop->getCategories() as $shop_category) {
            if ($shop_category === $category) {
              $category_is_set = true;
              break;
            }
          }
          if (!$category_is_set) {
            $this->shopRepository->postShopCategory($shop, $category);
          }
        }
      }

      $designs_data = [];
      foreach ($shop->getDesigns() as $design) {
        $designs_data[] = [
          'id' => $design->getId(),
          'machine_name' => $design->getMachineName(),
          'disabled' => $design->getDisabled()
        ];
      }

      $categories_data = [];
      foreach ($shop->getCategories() as $category) {
        $labels_data = [];
        foreach (
          $this->labelRepository->findBy(['category' => $category->getId()])
          as $label
        ) {
          $labels_data[] = [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
          ];
        }
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName(),
          'labels' => $labels_data
        ];
      }
      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $shop->getId(),
            'name' => $shop->getName(),
            'logo' => $shop->getLogo(),
            'uuid' => $shop->getUuid(),
            'license' => $shop->getLicense(),
            'email' => $shop->getEmail(),
            'address' => $shop->getAddress(),
            'phone' => $shop->getPhone(),
            'owner_first_name' => $shop->getOwnerFirstName(),
            'owner_last_name' => $shop->getOwnerLastName(),
            'owner_phone' => $shop->getOwnerPhone(),
            'payment_frequency' => $shop->getPaymentFrequency(),
            'pin' => $shop->getPin(),
            'disabled' => $shop->getDisabled(),
            'expiration_date' => $shop->getExpirationDate()->format('Y-m-d'),
            'subscription_date' => $shop->getSubscriptionDate()
              ? $shop->getSubscriptionDate()->format('Y-m-d')
              : null,
            'root' => $shop->getRoot(),
            'categories' => $categories_data,
            'designs' => $designs_data
          ]
        ],
        Response::HTTP_OK
      );
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("/{id}", name="delete_shop", methods={"DELETE"})
   */
  public function deleteShop($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }

      $shop = $this->shopRepository->findOneBy(['id' => $id]);
      if ($shop->getRoot()) {
        throw new Exception('no access');
      }

      if (empty($shop)) {
        throw new Exception('not found');
      }

      $slideshows = $this->slideshowRepository->findBy([
        'shop' => $shop->getId()
      ]);
      foreach ($slideshows as $slideshow) {
        if (!$slideshow->getDisabled()) {
          throw new Exception('constraint violation');
        }
      }
      foreach ($slideshows as $slideshow) {
        $this->slideshowRepository->deleteSlideshow($slideshow);
      }

      $this->shopRepository->deleteShop($shop);

      return new JsonResponse(['status' => 'ok']);
    } catch (DBALException $e) {
      if (strpos($e->getMessage(), 'Integrity constraint violation')) {
        $error = 'constraint violation';
      } else {
        $error = $e->getMessage();
      }
      return new JsonResponse(['error' => $error], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }
}

<?php

namespace App\Controller;

use App\Repository\SlideshowRepository;
use App\Repository\ShopRepository;
use App\Repository\DesignRepository;
use App\Repository\CategoryRepository;
use App\Repository\OptionValueRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class SlideshowController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/slideshows")
 */
class SlideshowController extends BaseController
{
  public function __construct(
    SlideshowRepository $slideshowRepository,
    ShopRepository $shopRepository,
    DesignRepository $designRepository,
    OptionValueRepository $optionValueRepository,
    CategoryRepository $categoryRepository
  ) {
    $this->slideshowRepository = $slideshowRepository;
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
    $this->optionValueRepository = $optionValueRepository;
    $this->categoryRepository = $categoryRepository;
  }

  /**
   * @Route("", name="post_slideshow", methods={"POST"})
   */
  public function postSlideshow($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }

      $data = json_decode($request->getContent(), true);

      $disabled = $data['disabled'];

      if (
        empty($data['name']) ||
        empty($data['speed']) ||
        empty($data['shop_id']) ||
        empty($data['design_id'])
      ) {
        throw new Exception('not enough data');
      }

      $name = $data['name'];
      $speed = $data['speed'];

      $shop = !empty($data['shop_id'])
        ? $this->shopRepository->findOneBy(['id' => $data['shop_id']])
        : null;

      if (empty($shop)) {
        throw new Exception('not found');
      }

      $design = !empty($data['design_id'])
        ? $this->designRepository->findOneBy(['id' => $data['design_id']])
        : null;
      //if (!$shop->getDesigns()->contains($design)) {
      //  $design = null;
      //}
      if (count($design->getShops()) > 0) {
        $this->shopRepository->postShopDesign($shop, $design);
      }

      $categories = [];
      $shop_categories = $shop->getCategories();
      if (count($shop->getCategories()) === 1) {
        $categories[] = $shop_categories[0];
      } else {
        if (array_key_exists('category_ids', $data)) {
          $available_category_ids = $shop
            ->getCategories()
            ->map(function ($obj) {
              return $obj->getId();
            })
            ->getValues();
          foreach ($data['category_ids'] as $category_id) {
            $categories[] = $this->categoryRepository->findOneBy([
              'id' => in_array(intval($category_id), $available_category_ids)
                ? $category_id
                : 0
            ]);
          }
        }
      }

      if (empty($categories)) {
        throw new Exception('not found');
      }

      $slideshow = $this->slideshowRepository->postSlideshow(
        $name,
        $speed,
        $disabled,
        $shop,
        $design
      );

      foreach ($categories as $category) {
        if (!empty($category)) {
          $this->slideshowRepository->postSlideshowCategory(
            $slideshow,
            $category
          );
        }
      }

      if (array_key_exists('option_values', $data)) {
        $this->optionValueRepository->rewriteOptionValues(
          'slideshow',
          $slideshow->getId(),
          [$slideshow->getDesign()->getId()],
          $data['option_values']
        );
      }

      $categories_data = [];
      foreach ($slideshow->getCategories() as $category) {
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'test' => count($design->getShops()),
            'id' => $slideshow->getId(),
            'name' => $slideshow->getName(),
            'speed' => $slideshow->getSpeed(),
            'disabled' => $slideshow->getDisabled(),
            'categories' => $categories_data,
            'empty' => count($slideshow->getSlides()) === 0,
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slideshow',
              $slideshow->getId()
            ),
            'design' => [
              'id' => $slideshow->getDesign()->getId(),
              'machine_name' => $slideshow->getDesign()->getMachineName(),
              'disabled' => $slideshow->getDesign()->getDisabled()
            ],
            'shop' => [
              'id' => $slideshow->getShop()->getId(),
              'name' => $slideshow->getShop()->getName(),
              'uuid' => $slideshow->getShop()->getUuid()
            ]
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
   * @Route("", name="get_slideshows", methods={"GET"})
   */
  public function getAllSlideshows(
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      // TODO abstract this
      $query = $request->query->all();
      $criteria = [];
      foreach ($query as $param => $value) {
        if ($param === 'page') {
          continue;
        }
        $criteria[$param] = $value === 'null' ? null : $value;
      }

      if ($this->root) {
        $slideshows = $this->slideshowRepository->findBy($criteria);
      } else {
        $slideshows = $this->slideshowRepository->findBy([
          'shop' => $this->shop_id,
          'disabled' => false
        ]);
      }

      $data = [];
      foreach ($slideshows as $slideshow) {
        $categories_data = [];
        foreach ($slideshow->getCategories() as $category) {
          $categories_data[] = [
            'id' => $category->getId(),
            'name' => $category->getName()
          ];
        }
        $data[] = [
          'id' => $slideshow->getId(),
          'name' => $slideshow->getName(),
          'speed' => $slideshow->getSpeed(),
          'disabled' => $slideshow->getDisabled(),
          'categories' => $categories_data,
          'empty' => count($slideshow->getSlides()) === 0,
          'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
            'slideshow',
            $slideshow->getId()
          ),
          'design' => [
            'id' => $slideshow->getDesign()->getId(),
            'machine_name' => $slideshow->getDesign()->getMachineName(),
            'disabled' => $slideshow->getDesign()->getDisabled()
          ],
          'shop' => [
            'id' => $slideshow->getShop()->getId(),
            'name' => $slideshow->getShop()->getName(),
            'uuid' => $slideshow->getShop()->getUuid()
          ]
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
   * @Route("/{id}", name="get_slideshow", methods={"GET"})
   */
  public function getSlideshow(
    $id,
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $id
        ]);
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $id,
          'shop' => $this->shop_id,
          'disabled' => false
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $categories_data = [];
      foreach ($slideshow->getCategories() as $category) {
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $slideshow->getId(),
            'name' => $slideshow->getName(),
            'speed' => $slideshow->getSpeed(),
            'disabled' => $slideshow->getDisabled(),
            'categories' => $categories_data,
            'empty' => count($slideshow->getSlides()) === 0,
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slideshow',
              $slideshow->getId()
            ),
            'design' => [
              'id' => $slideshow->getDesign()->getId(),
              'machine_name' => $slideshow->getDesign()->getMachineName(),
              'disabled' => $slideshow->getDesign()->getDisabled()
            ],
            'shop' => [
              'id' => $slideshow->getShop()->getId(),
              'name' => $slideshow->getShop()->getName(),
              'uuid' => $slideshow->getShop()->getUuid()
            ]
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
   * @Route("/{id}", name="patch_slideshow", methods={"PATCH"})
   */
  public function patchSlideshow(
    $uuid,
    $license,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);
      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $id
        ]);
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      if (!$this->root) {
        $data['disabled'] = null;
      }

      if (
        array_key_exists('design_id', $data) &&
        count($slideshow->getSlides()) === 0
      ) {
        if (!empty($data['design_id'])) {
          $data['design'] = $this->designRepository->findOneBy([
            'id' => $data['design_id']
          ]);

          if (
            !$this->root &&
            !$slideshow
              ->getShop()
              ->getDesigns()
              ->contains($data['design'])
          ) {
            $data['design'] = null;
          }

          if ($this->root && count($data['design']->getShops()) > 0) {
            $this->shopRepository->postShopDesign(
              $slideshow->getShop(),
              $data['design']
            );
          }
        }
      }

      $slideshow = $this->slideshowRepository->patchSlideshow(
        $slideshow,
        $data
      );

      if (array_key_exists('option_values', $data)) {
        $this->optionValueRepository->rewriteOptionValues(
          'slideshow',
          $slideshow->getId(),
          [$slideshow->getDesign()->getId()],
          $data['option_values']
        );
      }

      if (array_key_exists('category_ids', $data)) {
        foreach ($slideshow->getCategories() as $category) {
          $this->slideshowRepository->deleteSlideshowCategory(
            $slideshow,
            $category
          );
        }

        $available_category_ids = $slideshow
          ->getShop()
          ->getCategories()
          ->map(function ($obj) {
            return $obj->getId();
          })
          ->getValues();
        foreach ($data['category_ids'] as $category_id) {
          $category = $this->categoryRepository->findOneBy([
            'id' => in_array(intval($category_id), $available_category_ids)
              ? $category_id
              : 0
          ]);

          if (!empty($category)) {
            $this->slideshowRepository->postSlideshowCategory(
              $slideshow,
              $category
            );
          }
        }
      }
      $categories_data = [];
      foreach ($slideshow->getCategories() as $category) {
        $categories_data[] = [
          'id' => $category->getId(),
          'name' => $category->getName()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $slideshow->getId(),
            'name' => $slideshow->getName(),
            'speed' => $slideshow->getSpeed(),
            'disabled' => $slideshow->getDisabled(),
            'categories' => $categories_data,
            'empty' => count($slideshow->getSlides()) === 0,
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slideshow',
              $slideshow->getId()
            ),
            'design' => [
              'id' => $slideshow->getDesign()->getId(),
              'machine_name' => $slideshow->getDesign()->getMachineName(),
              'disabled' => $slideshow->getDesign()->getDisabled()
            ],
            'shop' => [
              'id' => $slideshow->getShop()->getId(),
              'name' => $slideshow->getShop()->getName(),
              'uuid' => $slideshow->getShop()->getUuid()
            ]
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
   * @Route("/{id}", name="delete_slideshow", methods={"DELETE"})
   */
  public function deleteSlideshow($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }
      $slideshow = $this->slideshowRepository->findOneBy([
        'id' => $id
      ]);

      if (empty($slideshow)) {
        throw new Exception('not found');
      }
      $this->slideshowRepository->deleteSlideshow($slideshow);

      return new JsonResponse(['status' => 'ok']);
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }
}

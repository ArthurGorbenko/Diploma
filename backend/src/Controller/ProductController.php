<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Repository\ShopRepository;
use App\Repository\CategoryRepository;
use App\Repository\DesignRepository;
use App\Repository\OptionValueRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\DBALException;

/**
 * Class ProductController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/products")
 */
class ProductController extends BaseController
{
  public function __construct(
    ProductRepository $productRepository,
    ShopRepository $shopRepository,
    DesignRepository $designRepository,
    OptionValueRepository $optionValueRepository,
    CategoryRepository $categoryRepository
  ) {
    $this->productRepository = $productRepository;
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
    $this->optionValueRepository = $optionValueRepository;
    $this->categoryRepository = $categoryRepository;
  }

  /**
   * @Route("", name="post_product", methods={"POST"})
   */
  public function postProduct($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);
      $data = json_decode($request->getContent(), true);

      if ($this->root) {
        $shop = !empty($data['shop_id'])
          ? $this->shopRepository->findOneBy(['id' => $data['shop_id']])
          : null;
        $category = !empty($data['category_id'])
          ? $this->categoryRepository->findOneBy(['id' => $data['category_id']])
          : null;
        if (!empty($shop) && !empty($category)) {
          throw new Exception('only one of {shop_id,category_id} is allowed');
        }
      } else {
        $shop = $this->shop;
        $category = !empty($data['category_id'])
          ? $this->categoryRepository->findOneBy(['id' => $data['category_id']])
          : null;
      }

      //if (empty($shop)) {
      //  throw new Exception('not found');
      //}

      if (
        empty($data['title']) ||
        empty($data['media_type']) ||
        empty($data['media_link']) ||
        empty($category)
      ) {
        throw new Exception('not enough data');
      }

      $title = $data['title'];
      $media_type = $data['media_type'];
      $media_link = $data['media_link'];

      $product = $this->productRepository->postProduct(
        $title,
        $media_type,
        $media_link,
        $shop,
        $category
      );

      $designs = [];
      if (array_key_exists('design_ids', $data)) {
        foreach ($data['design_ids'] as $design_id) {
          $design = $this->designRepository->findOneBy([
            'id' => $design_id,
            'disabled' => false
          ]);
          if ($this->root) {
            $designs[] = $design;
          } else {
            if (
              $shop->getDesigns()->contains($design) ||
              count($design->getShops()) === 0
            ) {
              $designs[] = $design;
            }
          }
        }
      }

      foreach ($designs as $design) {
        if (!empty($design)) {
          $this->productRepository->postProductDesign($product, $design);
        }
      }

      if (array_key_exists('option_values', $data)) {
        $this->optionValueRepository->rewriteOptionValues(
          'product',
          $product->getId(),
          $product
            ->getDesigns()
            ->map(function ($obj) {
              return $obj->getId();
            })
            ->getValues(),
          $data['option_values']
        );
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => $this->productToArray($product)
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
   * @Route("", name="get_products", methods={"GET"})
   */
  public function getAllProducts(
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
        $products = $this->productRepository->findBy($criteria);
      } else {
        $defaultProducts = [];
        $products = [];
        if (array_key_exists('shop', $criteria) && $criteria['shop'] === null) {
          $defaultProducts = $this->productRepository->findBy(
            array_merge($criteria, [
              'category' => $this->category_ids
            ])
          );
        } elseif (
          array_key_exists('shop', $criteria) &&
          intval($criteria['shop']) === $this->shop_id
        ) {
          $products = $this->productRepository->findBy(
            array_merge($criteria, [
              'shop' => $this->shop_id
            ])
          );
        } elseif (
          array_key_exists('category', $criteria) &&
          in_array(intval($criteria['category']), $this->category_ids)
        ) {
          $products = $this->productRepository->findBy(
            array_merge($criteria, [
              'shop' => $this->shop_id
            ])
          );
          $defaultProducts = $this->productRepository->findBy(
            array_merge($criteria, [
              'shop' => null
            ])
          );
        } else {
          $products = $this->productRepository->findBy(
            array_merge($criteria, [
              'shop' => $this->shop_id
              //'category' => $this->category_ids
            ])
          );
          //TODO check access here
          $defaultProducts = $this->productRepository->findBy(
            array_merge($criteria, [
              'shop' => null,
              'category' => $this->category_ids
            ])
          );
        }
        $products = array_merge($products, $defaultProducts);
      }
      $data = [];
      foreach ($products as $product) {
        $data[] = $this->productToArray($product);
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
   * @Route("/{id}", name="get_product", methods={"GET"})
   */
  public function getProduct(
    $id,
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $product = $this->productRepository->findOneBy(['id' => $id]);
      } else {
        $product = $this->productRepository->findOneBy([
          'id' => $id,
          'shop' => $this->shop_id
        ]);
        if (empty($product)) {
          $product = $this->productRepository->findOneBy([
            'id' => $id,
            'category' => $this->category_ids
          ]);
        }
      }

      if (empty($product)) {
        throw new Exception('not found');
      }

      $designs_data = [];
      foreach ($product->getDesigns() as $design) {
        $designs_data[] = [
          'id' => $design->getId(),
          'machine_name' => $design->getMachineName(),
          'disabled' => $design->getDisabled()
        ];
      }
      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => $this->productToArray($product)
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
   * @Route("/{id}", name="patch_product", methods={"PATCH"})
   */
  public function patchProduct(
    $uuid,
    $license,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      $data = json_decode($request->getContent(), true);
      if ($this->root) {
        $product = $this->productRepository->findOneBy(['id' => $id]);

        if (!empty($data['shop_id'])) {
          if (empty($product->getShop())) {
            throw new Exception(
              'you are not allowed to edit shop of a category product'
            );
          }
          $data['shop'] = $this->shopRepository->findOneBy([
            'id' => $data['shop_id']
          ]);
        }

        if (!empty($data['category_id'])) {
          if (empty($product->getCategory())) {
            throw new Exception(
              'you are not allowed to edit category of a shop product'
            );
          }
          $data['category'] = $this->categoryRepository->findOneBy([
            'id' => $data['category_id']
          ]);
        }
        if (!empty($data['shop']) && !empty($data['category'])) {
          throw new Exception('only one of {shop,category} is allowed');
        }
      } else {
        $data['shop'] = $this->shop;
        $data['category'] = $this->categoryRepository->findOneBy([
          'id' => array_key_exists('category_id', $data)
            ? $data['category_id']
            : 0
        ]);

        $product = $this->productRepository->findOneBy([
          'id' => $id,
          'shop' => $this->shop_id
        ]);
        if (empty($product)) {
          $product = $this->productRepository->findOneBy([
            'id' => $id,
            'category' => $this->category_ids
          ]);
        }
      }

      if (empty($product)) {
        throw new Exception('not found');
      }

      $product = $this->productRepository->patchProduct($product, $data);

      $designs = [];
      if (array_key_exists('design_ids', $data)) {
        foreach ($product->getDesigns() as $design) {
          $this->productRepository->deleteProductDesign($product, $design);
        }
        foreach ($data['design_ids'] as $design_id) {
          $design = $this->designRepository->findOneBy([
            'id' => $design_id,
            'disabled' => false
          ]);
          if (!$this->root) {
            if (
              !$this->shop->getDesigns()->contains($design) &&
              count($design->getShops()) !== 0
            ) {
              $design = null;
            }
          }
          if (!empty($design)) {
            $this->productRepository->postProductDesign($product, $design);
          }
        }
      }

      if (array_key_exists('option_values', $data)) {
        $this->optionValueRepository->rewriteOptionValues(
          'product',
          $product->getId(),
          $product
            ->getDesigns()
            ->map(function ($obj) {
              return $obj->getId();
            })
            ->getValues(),
          $data['option_values']
        );
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => $this->productToArray($product)
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
   * @Route("/{id}", name="delete_product", methods={"DELETE"})
   */
  public function deleteProduct($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);
      if ($this->root) {
        $product = $this->productRepository->findOneBy(['id' => $id]);
      } else {
        $product = $this->productRepository->findOneBy([
          'id' => $id,
          'shop' => $this->shop_id
        ]);
        if (empty($product)) {
          $product = $this->productRepository->findOneBy([
            'id' => $id,
            'category' => $this->category_ids
          ]);
        }
      }

      if (empty($product)) {
        throw new Exception('not found');
      }
      $this->productRepository->deleteProduct($product);

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

  public function productToArray($product)
  {
    $designs_data = [];
    foreach ($product->getDesigns() as $design) {
      $designs_data[] = [
        'id' => $design->getId(),
        'machine_name' => $design->getMachineName(),
        'disabled' => $design->getDisabled()
      ];
    }

    return [
      'id' => $product->getId(),
      'title' => $product->getTitle(),
      'media_type' => $product->getMediaType(),
      'media_link' => $product->getMediaLink(),
      'designs' => $designs_data,
      'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
        'product',
        $product->getId()
      ),
      'shop' => !empty($product->getShop())
        ? [
          'id' => $product->getShop()->getId(),
          'name' => $product->getShop()->getName()
        ]
        : null,
      'category' => !empty($product->getCategory())
        ? [
          'id' => $product->getCategory()->getId(),
          'name' => $product->getCategory()->getName()
        ]
        : null
    ];
  }
}

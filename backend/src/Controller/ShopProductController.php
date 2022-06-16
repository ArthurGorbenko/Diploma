<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Controller\ProductController;
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
 * Class ShopProductController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/shops/{shop_id}/products")
 */
class ShopProductController extends BaseController
{
  public function __construct(
    ProductRepository $productRepository,
    ProductController $productController,
    ShopRepository $shopRepository,
    DesignRepository $designRepository,
    OptionValueRepository $optionValueRepository,
    CategoryRepository $categoryRepository
  ) {
    $this->productRepository = $productRepository;
    $this->productController = $productController;
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
    $this->optionValueRepository = $optionValueRepository;
    $this->categoryRepository = $categoryRepository;
  }

  /**
   * @Route("", name="get_shop_products", methods={"GET"})
   */
  public function getAllShopProducts(
    $uuid,
    $license,
    $shop_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }

      $this->shop_id = $shop_id;
      $shop = $this->shopRepository->findOneBy(['id' => $this->shop_id]);

      if (empty($shop)) {
        throw new Exception('not found');
      }

      $this->category_ids = $shop
        ->getCategories()
        ->map(function ($obj) {
          return $obj->getId();
        })
        ->getValues();

      // TODO abstract this
      $query = $request->query->all();
      $criteria = [];
      foreach ($query as $param => $value) {
        if ($param === 'page') {
          continue;
        }
        $criteria[$param] = $value === 'null' ? null : $value;
      }

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
      $data = [];
      foreach ($products as $product) {
        $data[] = $this->productController->productToArray($product);
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
}

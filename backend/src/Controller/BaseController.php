<?php

namespace App\Controller;

use App\Repository\ShopRepository;
use App\Repository\DesignRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
//use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Config\Definition\Exception\Exception;

class BaseController
{
  public $shop;
  public $shop_id;
  public $root;
  public $category_id;
  public function __construct(
    ShopRepository $shopRepository,
    DesignRepository $designRepository
  ) {
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
  }

  protected function checkLicense($uuid, $license)
  {
    $shop = $this->shopRepository->findOneBy([
      'uuid' => $uuid,
      'license' => $license
    ]);

    if (empty($shop)) {
      throw new Exception('invalid license');
    }
    if ($shop->getDisabled()) {
      throw new Exception('disabled license');
    }
    if (
      !$shop->getRoot() &&
      $shop->getExpirationDate()->getTimestamp() < time()
    ) {
      throw new Exception('expired license');
    }
    $this->shop = $shop;
    $this->shop_id = $shop->getId();
    $this->root = $shop->getRoot();
    if (!empty($shop->getCategories())) {
      foreach ($shop->getCategories() as $category) {
        $this->category_ids[] = $category->getId();
      }
    } else {
      $this->category_ids = null;
    }

    $this->design_ids = [];

    foreach ($shop->getDesigns() as $design) {
      $this->design_ids[] = $design->getId();
    }
    foreach ($this->designRepository->findAll() as $design) {
      if (count($design->getShops()) === 0) {
        $this->design_ids[] = $design->getId();
      }
    }

    if ($this->design_ids === []) {
      $this->design_ids = null;
    }
    return;
  }

  protected function paginateData($items, $page)
  {
    if ($page === '0') {
      return ['data' => $items];
    }
    $limit = 10;
    return [
      'data' => array_slice($items, ($page - 1) * $limit, $limit),
      'page' => $page,
      'total_items' => count($items),
      'items_per_page' => $limit
    ];
  }
}

?>

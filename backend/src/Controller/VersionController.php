<?php

namespace App\Controller;

use App\Repository\SlideshowRepository;
use App\Repository\ShopRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class VersionController
 * @package App\Controller
 *
 * @Route(path="/api/version/{uuid}/{slideshow_id}")
 */

class VersionController
{
  public function __construct(
    SlideshowRepository $slideshowRepository,
    ShopRepository $shopRepository
  ) {
    $this->slideshowRepository = $slideshowRepository;
    $this->shopRepository = $shopRepository;
  }
  /**
   * @Route("", name="get_version", methods={"GET"})
   */
  public function getVersion($uuid, $slideshow_id): JsonResponse
  {
    try {
      $shop = $this->shopRepository->findOneBy([
        'uuid' => $uuid
      ]);

      if (empty($shop)) {
        throw new Exception('invalid uuid');
      }
      if ($shop->getDisabled()) {
        throw new Exception('disabled license');
      }
      if ($shop->getExpirationDate()->getTimestamp() < time()) {
        throw new Exception('expired license');
      }

      $slideshow = $this->slideshowRepository->findOneBy([
        'id' => $slideshow_id,
        'shop' => $shop->getId()
      ]);

      if (empty($slideshow)) {
        throw new Exception('not found');
      }
      if ($slideshow->getDisabled()) {
        throw new Exception('disabled slideshow');
      }

      return new JsonResponse(
        ['version' => $slideshow->getVersion(), 'status' => 'ok'],
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

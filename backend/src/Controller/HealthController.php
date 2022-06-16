<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class HealthController
 * @package App\Controller
 *
 * @Route(path="/api/health")
 */

class HealthController
{
  /**
   * @Route("", name="get_health", methods={"GET"})
   */
  public function getHealth(): JsonResponse
  {
    return new JsonResponse(['status' => 'ok'], Response::HTTP_OK);
  }
}

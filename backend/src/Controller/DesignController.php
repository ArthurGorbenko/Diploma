<?php

namespace App\Controller;

use App\Repository\DesignRepository;
use App\Repository\ShopRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Doctrine\DBAL\DBALException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class DesignController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/designs")
 */
class DesignController extends BaseController
{
  public function __construct(
    DesignRepository $designRepository,
    ShopRepository $shopRepository
  ) {
    $this->designRepository = $designRepository;
    $this->shopRepository = $shopRepository;
  }

  /**
   * @Route("", name="post_design", methods={"POST"})
   */
  public function postDesign($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      throw new Exception('no access');

      //if (!$this->root) {
      //  throw new Exception("no access");
      //}

      //$data = json_decode($request->getContent(), true);

      //$name = $data['name'];

      //if (empty($name)) {
      //  throw new Exception('not enough data');
      //}

      //$design = $this->designRepository->postDesign($name);

      //return new JsonResponse(
      //  [
      //    'status' => 'ok',
      //    'data' => ['id' => $design->getId(), 'name' => $design->getName()]
      //  ],
      //  Response::HTTP_CREATED
      //);
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("", name="get_designs", methods={"GET"})
   */
  public function getAllDesigns($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $designs = $this->designRepository->findAll();
      $data = [];
      foreach ($designs as $design) {
        $data[] = [
          'id' => $design->getId(),
          'machine_name' => $design->getMachineName(),
          'disabled' => $design->getDisabled()
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
   * @Route("/{id}", name="get_design", methods={"GET"})
   */
  public function getDesign(
    $id,
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }

      $design = $this->designRepository->findOneBy(['id' => $id]);

      if (empty($design)) {
        throw new Exception('not found');
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $design->getId(),
            'machine_name' => $design->getMachineName(),
            'disabled' => $design->getDisabled()
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
   * @Route("/{id}", name="patch_design", methods={"PATCH"})
   */
  public function patchDesign(
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
      $design = $this->designRepository->findOneBy(['id' => $id]);

      if (empty($design)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $design = $this->designRepository->patchDesign($design, $data);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $design->getId(),
            'machine_name' => $design->getMachineName(),
            'disabled' => $design->getDisabled()
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
   * @Route("/{id}", name="delete_design", methods={"DELETE"})
   */
  public function deleteDesign($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      throw new Exception('no access');

      // if (!$this->root) {
      //   throw new Exception("no access");
      // }
      // $design = $this->designRepository->findOneBy(['id' => $id]);

      // if (empty($design)) {
      //   throw new Exception('not found');
      // }
      // $this->designRepository->deleteDesign($design);

      // return new JsonResponse(['status' => 'ok']);
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

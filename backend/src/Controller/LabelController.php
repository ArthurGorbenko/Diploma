<?php

namespace App\Controller;

use App\Repository\LabelRepository;
use App\Repository\ShopRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use App\Repository\DesignRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class LabelController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/categories/{category_id}/labels")
 */
class LabelController extends BaseController
{
  public function __construct(
    LabelRepository $labelRepository,
    CategoryRepository $categoryRepository,
    ProductRepository $productRepository,
    ShopRepository $shopRepository,
    DesignRepository $designRepository
  ) {
    $this->labelRepository = $labelRepository;
    $this->categoryRepository = $categoryRepository;
    $this->shopRepository = $shopRepository;
    $this->productRepository = $productRepository;
    $this->designRepository = $designRepository;
  }

  /**
   * @Route("", name="post_label", methods={"POST"})
   */
  public function postLabel(
    $uuid,
    $license,
    $category_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $category = $this->categoryRepository->findOneBy([
        'id' => $category_id
      ]);
      if (empty($category)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      if (empty($data['name']) || empty($data['image_link'])) {
        throw new Exception('not enough data');
      }

      $name = $data['name'];
      $image_link = $data['image_link'];

      $label = $this->labelRepository->postLabel($name, $image_link, $category);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
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
   * @Route("", name="get_labels", methods={"GET"})
   */
  public function getAllLabels(
    $uuid,
    $license,
    $category_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $category = $this->categoryRepository->findOneBy([
          'id' => $category_id
        ]);
      } else {
        $category = $this->categoryRepository->findOneBy([
          'id' => in_array(intval($category_id), $this->category_ids)
            ? $category_id
            : 0
        ]);
      }
      if (empty($category)) {
        throw new Exception('not found');
      }
      $labels = $this->labelRepository->findBy(['category' => $category_id]);
      $data = [];
      foreach ($labels as $label) {
        $data[] = [
          'id' => $label->getId(),
          'name' => $label->getName(),
          'image_link' => $label->getImageLink(),
          'category_id' => $category->getId()
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
   * @Route("/{id}", name="get_label", methods={"GET"})
   */
  public function getLabel(
    $uuid,
    $license,
    $category_id,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $category = $this->categoryRepository->findOneBy([
        'id' => $category_id
      ]);
      if (empty($category)) {
        throw new Exception('not found');
      }

      $label = $this->labelRepository->findOneBy([
        'id' => $id,
        'category' => $category_id
      ]);

      if (empty($label)) {
        throw new Exception('not found');
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
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
   * @Route("/{id}", name="patch_label", methods={"PATCH"})
   */
  public function patchLabel(
    $uuid,
    $license,
    $category_id,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $category = $this->categoryRepository->findOneBy([
        'id' => $category_id
      ]);
      if (empty($category)) {
        throw new Exception('not found');
      }

      $label = $this->labelRepository->findOneBy([
        'id' => $id,
        'category' => $category_id
      ]);

      if (empty($label)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $this->labelRepository->patchLabel($label, $data);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
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
   * @Route("/{id}", name="delete_label", methods={"DELETE"})
   */
  public function deleteLabel($uuid, $license, $category_id, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $category = $this->categoryRepository->findOneBy([
        'id' => $category_id
      ]);
      if (empty($category)) {
        throw new Exception('not found');
      }

      $label = $this->labelRepository->findOneBy([
        'id' => $id,
        'category' => $category_id
      ]);

      if (empty($label)) {
        throw new Exception('not found');
      }

      $this->labelRepository->deleteLabel($label);

      return new JsonResponse(['status' => 'ok']);
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }
}

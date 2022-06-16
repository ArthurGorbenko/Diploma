<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use App\Repository\ShopRepository;
use App\Repository\LabelRepository;
use App\Repository\DesignRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Doctrine\DBAL\DBALException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class CategoryController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/categories")
 */
class CategoryController extends BaseController
{
  public function __construct(
    CategoryRepository $categoryRepository,
    LabelRepository $labelRepository,
    ShopRepository $shopRepository,
    DesignRepository $designRepository
  ) {
    $this->categoryRepository = $categoryRepository;
    $this->labelRepository = $labelRepository;
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
  }

  /**
   * @Route("", name="post_category", methods={"POST"})
   */
  public function postCategory($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }

      $data = json_decode($request->getContent(), true);

      if (empty($data['name'])) {
        throw new Exception('not enough data');
      }

      $name = $data['name'];

      $category = $this->categoryRepository->postCategory($name);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => ['id' => $category->getId(), 'name' => $category->getName()]
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
   * @Route("", name="get_categories", methods={"GET"})
   */
  public function getAllCategories(
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }
      $categories = $this->categoryRepository->findAll();
      $data = [];
      foreach ($categories as $category) {
        $labels = $this->labelRepository->findBy([
          'category' => $category->getId()
        ]);
        $labels_data = [];
        foreach ($labels as $label) {
          $labels_data[] = [
            'id' => $label->getId(),
            'name' => $label->getName(),
            'image_link' => $label->getImageLink(),
            'category_id' => $category->getId()
          ];
        }
        $data[] = [
          'id' => $category->getId(),
          'name' => $category->getName(),
          'labels' => $labels_data
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
   * @Route("/{id}", name="get_category", methods={"GET"})
   */
  public function getCategory(
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

      $category = $this->categoryRepository->findOneBy(['id' => $id]);

      if (empty($category)) {
        throw new Exception('not found');
      }

      $labels = $this->labelRepository->findBy([
        'category' => $category->getId()
      ]);
      $labels_data = [];
      foreach ($labels as $label) {
        $labels_data[] = [
          'id' => $label->getId(),
          'name' => $label->getName(),
          'image_link' => $label->getImageLink(),
          'category_id' => $category->getId()
        ];
      }
      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'labels' => $labels_data
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
   * @Route("/{id}", name="patch_category", methods={"PATCH"})
   */
  public function patchCategory(
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
      $category = $this->categoryRepository->findOneBy(['id' => $id]);

      if (empty($category)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $category = $this->categoryRepository->patchCategory($category, $data);

      $labels = $this->labelRepository->findBy([
        'category' => $category->getId()
      ]);
      $labels_data = [];
      foreach ($labels as $label) {
        $labels_data[] = [
          'id' => $label->getId(),
          'name' => $label->getName(),
          'image_link' => $label->getImageLink(),
          'category_id' => $category->getId()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'labels' => $labels_data
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
   * @Route("/{id}", name="delete_category", methods={"DELETE"})
   */
  public function deleteCategory($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }
      $category = $this->categoryRepository->findOneBy(['id' => $id]);

      if (empty($category)) {
        throw new Exception('not found');
      }
      $this->categoryRepository->deleteCategory($category);

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

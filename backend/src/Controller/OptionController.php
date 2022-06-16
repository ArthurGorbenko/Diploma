<?php

namespace App\Controller;

use App\Repository\OptionRepository;
use App\Repository\OptionValueRepository;
use App\Repository\ShopRepository;
use App\Repository\SlideshowRepository;
use App\Repository\DesignRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Doctrine\DBAL\DBALException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class OptionController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/options")
 */
class OptionController extends BaseController
{
  public function __construct(
    OptionRepository $optionRepository,
    OptionValueRepository $optionValueRepository,
    ShopRepository $shopRepository,
    SlideshowRepository $slideshowRepository,
    DesignRepository $designRepository
  ) {
    $this->optionRepository = $optionRepository;
    $this->optionValueRepository = $optionValueRepository;
    $this->shopRepository = $shopRepository;
    $this->slideshowRepository = $slideshowRepository;
    $this->designRepository = $designRepository;
  }

  /**
   * @Route("", name="post_option", methods={"POST"})
   */
  public function postOption($uuid, $license, Request $request): JsonResponse
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

      //$option = $this->optionRepository->postOption($name);

      //return new JsonResponse(
      //  [
      //    'status' => 'ok',
      //    'data' => ['id' => $option->getId(), 'name' => $option->getName()]
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
   * @Route("", name="get_options", methods={"GET"})
   */
  public function getAllOptions($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      // TODO abstract this
      $query = $request->query->all();
      $criteria = [];
      foreach ($query as $param => $value) {
        if ($param === 'page' || $param === 'slideshow') {
          continue;
        }
        $criteria[$param] = $value === 'null' ? null : $value;
      }

      $slideshow = $this->slideshowRepository->find(
        $request->query->get('slideshow', 0)
      );

      if ($this->root) {
        $options = $this->optionRepository->findBy($criteria);
      } else {
        $options = $this->optionRepository->findBy(
          array_merge($criteria, [
            'disabled' => false,
            'design' => array_key_exists('design', $criteria)
              ? array_intersect($this->design_ids, $criteria['design'])
              : $this->design_ids
          ])
        );
      }
      $data = [];
      foreach ($options as $option) {
        $data[] = [
          'id' => $option->getId(),
          'machine_name' => $option->getMachineName(),
          'translation_key' => $option->getTranslationKey(),
          'type' => $option->getType(),
          'target_entity' => $option->getTargetEntity(),
          'default_value' => $this->optionValueRepository->getDefaultValueWithOverwrite(
            $option,
            $slideshow
          ),
          'supported_values' => $option->getSupportedValues(),
          'design' => [
            'id' => $option->getDesign()->getId(),
            'machine_name' => $option->getDesign()->getMachineName(),
            'disabled' => $option->getDesign()->getDisabled()
          ],
          'disabled' => $option->getDisabled()
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
   * @Route("/{id}", name="get_option", methods={"GET"})
   */
  public function getOption(
    $id,
    $uuid,
    $license,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $option = $this->optionRepository->findOneBy(['id' => $id]);
      } else {
        $option = $this->optionRepository->findOneBy([
          'id' => $id,
          'design' => $this->design_ids,
          'disabled' => false
        ]);
      }

      if (empty($option)) {
        throw new Exception('not found');
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $option->getId(),
            'machine_name' => $option->getMachineName(),
            'translation_key' => $option->getTranslationKey(),
            'type' => $option->getType(),
            'target_entity' => $option->getTargetEntity(),
            'default_value' => $option->getDefaultValue()[0],
            'supported_values' => $option->getSupportedValues(),
            'design' => [
              'id' => $option->getDesign()->getId(),
              'machine_name' => $option->getDesign()->getMachineName(),
              'disabled' => $option->getDesign()->getDisabled()
            ],
            'disabled' => $option->getDisabled()
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
   * @Route("/{id}", name="patch_option", methods={"PATCH"})
   */
  public function patchOption(
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
      $option = $this->optionRepository->findOneBy(['id' => $id]);

      if (empty($option)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $data['translation_key'] = null;
      $data['default_value'] = null;
      $data['supported_values'] = null;

      $option = $this->optionRepository->patchOption($option, $data);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $option->getId(),
            'machine_name' => $option->getMachineName(),
            'translation_key' => $option->getTranslationKey(),
            'type' => $option->getType(),
            'target_entity' => $option->getTargetEntity(),
            'default_value' => $option->getDefaultValue()[0],
            'supported_values' => $option->getSupportedValues(),
            'design' => [
              'id' => $option->getDesign()->getId(),
              'machine_name' => $option->getDesign()->getMachineName(),
              'disabled' => $option->getDesign()->getDisabled()
            ],
            'disabled' => $option->getDisabled()
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
   * @Route("/{id}", name="delete_option", methods={"DELETE"})
   */
  public function deleteOption($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      throw new Exception('no access');

      // if (!$this->root) {
      //   throw new Exception("no access");
      // }
      // $option = $this->optionRepository->findOneBy(['id' => $id]);

      // if (empty($option)) {
      //   throw new Exception('not found');
      // }
      // $this->optionRepository->deleteOption($option);

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

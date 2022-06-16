<?php

namespace App\Controller;

use App\Repository\EventImageRepository;
use App\Repository\EventRepository;
use App\Repository\ShopRepository;
use App\Repository\DesignRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Doctrine\DBAL\DBALException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class EventImageController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/events/{event_id}/images")
 */
class EventImageController extends BaseController
{
  public function __construct(
    EventImageRepository $eventImageRepository,
    EventRepository $eventRepository,
    ShopRepository $shopRepository,
    DesignRepository $designRepository
  ) {
    $this->eventRepository = $eventRepository;
    $this->eventImageRepository = $eventImageRepository;
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
  }

  /**
   * @Route("", name="post_event_image", methods={"POST"})
   */
  public function postEventImage(
    $uuid,
    $license,
    $event_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if (!$this->root) {
        throw new Exception('no access');
      }

      $event = $this->eventRepository->findOneBy([
        'id' => $event_id
      ]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      if (empty($data['image_link'])) {
        throw new Exception('not enough data');
      }

      $image_link = $data['image_link'];

      $eventImage = $this->eventImageRepository->postEventImage(
        $event,
        $image_link
      );

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $eventImage->getId(),
            'image_link' => $eventImage->getImageLink(),
            'event' => [
              'id' => $eventImage->getEvent()->getId(),
              'name' => $eventImage->getEvent()->getName()
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
   * @Route("", name="get_event_images", methods={"GET"})
   */
  public function getAllEventImages(
    $uuid,
    $license,
    $event_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      $event = $this->eventRepository->findOneBy([
        'id' => $event_id
      ]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      $eventImages = $this->eventImageRepository->findBy([
        'event' => $event_id
      ]);
      $data = [];
      foreach ($eventImages as $eventImage) {
        $data[] = [
          'id' => $eventImage->getId(),
          'image_link' => $eventImage->getImageLink(),
          'event' => [
            'id' => $eventImage->getEvent()->getId(),
            'name' => $eventImage->getEvent()->getName()
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
   * @Route("/{id}", name="get_event_image", methods={"GET"})
   */
  public function getEventImage(
    $id,
    $uuid,
    $license,
    $event_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      $event = $this->eventRepository->findOneBy([
        'id' => $event_id
      ]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      $eventImage = $this->eventImageRepository->findOneBy([
        'event' => $event_id,
        'id' => $id
      ]);

      if (empty($eventImage)) {
        throw new Exception('not found');
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $eventImage->getId(),
            'image_link' => $eventImage->getImageLink(),
            'event' => [
              'id' => $eventImage->getEvent()->getId(),
              'name' => $eventImage->getEvent()->getName()
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
   * @Route("/{id}", name="patch_event_image", methods={"PATCH"})
   */
  public function patchEventImage(
    $uuid,
    $license,
    $event_id,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }

      $event = $this->eventRepository->findOneBy([
        'id' => $event_id
      ]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      $eventImage = $this->eventImageRepository->findOneBy([
        'event' => $event_id,
        'id' => $id
      ]);

      if (empty($eventImage)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $eventImage = $this->eventImageRepository->patchEventImage(
        $eventImage,
        $data
      );

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $eventImage->getId(),
            'image_link' => $eventImage->getImageLink(),
            'event' => [
              'id' => $eventImage->getEvent()->getId(),
              'name' => $eventImage->getEvent()->getName()
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
   * @Route("/{id}", name="delete_event_image", methods={"DELETE"})
   */
  public function deleteEventImage(
    $uuid,
    $license,
    $event_id,
    $id
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }
      $event = $this->eventRepository->findOneBy([
        'id' => $event_id
      ]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      $eventImage = $this->eventImageRepository->findOneBy([
        'event' => $event_id,
        'id' => $id
      ]);

      if (empty($eventImage)) {
        throw new Exception('not found');
      }
      $this->eventImageRepository->deleteEventImage($eventImage);

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

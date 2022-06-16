<?php

namespace App\Controller;

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
 * Class EventController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/events")
 */
class EventController extends BaseController
{
  public function __construct(
    EventRepository $eventRepository,
    ShopRepository $shopRepository,
    DesignRepository $designRepository
  ) {
    $this->eventRepository = $eventRepository;
    $this->shopRepository = $shopRepository;
    $this->designRepository = $designRepository;
  }

  /**
   * @Route("", name="post_event", methods={"POST"})
   */
  public function postEvent($uuid, $license, Request $request): JsonResponse
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

      $event = $this->eventRepository->postEvent($name);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => ['id' => $event->getId(), 'name' => $event->getName()]
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
   * @Route("", name="get_events", methods={"GET"})
   */
  public function getAllEvents($uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      $events = $this->eventRepository->findAll();
      $data = [];
      foreach ($events as $event) {
        $data[] = [
          'id' => $event->getId(),
          'name' => $event->getName()
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
   * @Route("/{id}", name="get_event", methods={"GET"})
   */
  public function getEvent($id, $uuid, $license, Request $request): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      $event = $this->eventRepository->findOneBy(['id' => $id]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $event->getId(),
            'name' => $event->getName()
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
   * @Route("/{id}", name="patch_event", methods={"PATCH"})
   */
  public function patchEvent(
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
      $event = $this->eventRepository->findOneBy(['id' => $id]);

      if (empty($event)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $event = $this->eventRepository->patchEvent($event, $data);

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $event->getId(),
            'name' => $event->getName()
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
   * @Route("/{id}", name="delete_event", methods={"DELETE"})
   */
  public function deleteEvent($uuid, $license, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);
      if (!$this->root) {
        throw new Exception('no access');
      }
      $event = $this->eventRepository->findOneBy(['id' => $id]);

      if (empty($event)) {
        throw new Exception('not found');
      }
      $this->eventRepository->deleteEvent($event);

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

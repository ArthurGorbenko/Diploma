<?php

namespace App\Controller;

use App\Repository\SlideRepository;
use App\Repository\ShopRepository;
use App\Repository\SlideshowRepository;
use App\Repository\SlideImageRepository;
use App\Repository\SlideVideoRepository;
use App\Repository\SlideProductRepository;
use App\Repository\ProductRepository;
use App\Repository\LabelRepository;
use App\Repository\DesignRepository;
use App\Repository\OptionValueRepository;
use App\Repository\EventImageRepository;
use App\Repository\SlideEventImageRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class SlideController
 * @package App\Controller
 *
 * @Route(path="/api/{uuid}/{license}/slideshows/{slideshow_id}/slides")
 */
class SlideController extends BaseController
{
  public function __construct(
    SlideRepository $slideRepository,
    SlideImageRepository $slideImageRepository,
    SlideVideoRepository $slideVideoRepository,
    SlideProductRepository $slideProductRepository,
    SlideshowRepository $slideshowRepository,
    ProductRepository $productRepository,
    LabelRepository $labelRepository,
    ShopRepository $shopRepository,
    OptionValueRepository $optionValueRepository,
    DesignRepository $designRepository,
    EventImageRepository $eventImageRepository,
    SlideEventImageRepository $slideEventImageRepository
  ) {
    $this->slideRepository = $slideRepository;
    $this->slideImageRepository = $slideImageRepository;
    $this->slideVideoRepository = $slideVideoRepository;
    $this->slideProductRepository = $slideProductRepository;
    $this->slideshowRepository = $slideshowRepository;
    $this->shopRepository = $shopRepository;
    $this->productRepository = $productRepository;
    $this->labelRepository = $labelRepository;
    $this->optionValueRepository = $optionValueRepository;
    $this->designRepository = $designRepository;
    $this->eventImageRepository = $eventImageRepository;
    $this->slideEventImageRepository = $slideEventImageRepository;
  }

  /**
   * @Route("", name="post_slide", methods={"POST"})
   */
  public function postSlide(
    $uuid,
    $license,
    $slideshow_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id
        ]);
        $this->shop_id = $slideshow->getShop()->getId();
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      if (
        empty($data['type']) ||
        empty($data['slide_data']) ||
        !array_key_exists('disabled', $data)
      ) {
        throw new Exception('not enough data');
      }

      $type = $data['type'];
      $slide_data = $data['slide_data'];
      $disabled = $data['disabled'];

      if (
        !(
          $type === 'product' ||
          $type === 'event_image' ||
          $type === 'image' ||
          $type === 'video'
        )
      ) {
        throw new Exception(
          'type should be one of {"product","image","video","event_image"}'
        );
      }

      $slides = $this->slideRepository->findBy(['slideshow' => $slideshow_id]);
      $number = count($slides) + 1;

      $slide = $this->slideRepository->postSlide(
        $type,
        $slideshow,
        $number,
        $disabled
      );

      if (array_key_exists('option_values', $data)) {
        $this->optionValueRepository->rewriteOptionValues(
          'slide',
          $slide->getId(),
          [
            $slide
              ->getSlideshow()
              ->getDesign()
              ->getId()
          ],
          $data['option_values']
        );
      }

      switch ($type) {
        case 'product':
          if (empty($slide_data['product_id'])) {
            $this->slideRepository->deleteSlide($slide);
            throw new Exception('not enough data');
          }
          $product = $this->productRepository->findOneBy([
            'id' => $slide_data['product_id'],
            'shop' => $this->shop_id
          ]);

          if (!empty($slideshow->getShop()->getCategories())) {
            foreach ($slideshow->getShop()->getCategories() as $category) {
              $this->category_ids[] = $category->getId();
            }
          } else {
            $this->category_ids = null;
          }

          if (empty($product)) {
            $product = $this->productRepository->findOneBy([
              'id' => $slide_data['product_id'],
              'category' => $this->category_ids
            ]);
          }

          if (empty($product)) {
            $this->slideRepository->deleteSlide($slide);
            throw new Exception('not found');
          }

          $title = empty($slide_data['title']) ? null : $slide_data['title'];
          $price1 = empty($slide_data['price1']) ? null : $slide_data['price1'];
          $price1_detail = empty($slide_data['price1_detail'])
            ? null
            : $slide_data['price1_detail'];
          $price2 = empty($slide_data['price2']) ? null : $slide_data['price2'];
          $price2_detail = empty($slide_data['price2_detail'])
            ? null
            : $slide_data['price2_detail'];
          $event = empty($slide_data['event']) ? null : $slide_data['event'];
          $country = empty($slide_data['country'])
            ? null
            : $slide_data['country'];
          $slideProduct = $this->slideProductRepository->postSlideProduct(
            $product,
            $title,
            $price1,
            $price1_detail,
            $price2,
            $price2_detail,
            $event,
            $country,
            $slide
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_product',
              $slideProduct->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $labels = [];
          if (array_key_exists('label_ids', $slide_data)) {
            foreach ($slide_data['label_ids'] as $label_id) {
              $label = $this->labelRepository->findOneBy([
                'id' => $label_id,
                'category' => $this->category_ids
              ]);
              if (!empty($label)) {
                $this->slideProductRepository->postSlideProductLabel(
                  $slideProduct,
                  $label
                );
              }
            }
          }

          $labels_data = [];

          foreach ($slideProduct->getLabels() as $label) {
            $labels_data[] = [
              'id' => $label->getId(),
              'name' => $label->getName(),
              'image_link' => $label->getImageLink(),
              'category_id' => $label->getCategory()->getId()
            ];
          }

          $slide_data = [
            'product' => [
              'id' => $slideProduct->getProduct()->getId(),
              'title' => $slideProduct->getProduct()->getTitle()
            ],
            'title' => $slideProduct->getTitle(),
            'event' => $slideProduct->getEvent(),
            'country' => $slideProduct->getCountry(),
            'labels' => $labels_data,
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_product',
              $slideProduct->getId()
            ),
            'price1' => $slideProduct->getPrice1(),
            'price1_detail' => $slideProduct->getPrice1Detail(),
            'price2' => $slideProduct->getPrice2(),
            'price2_detail' => $slideProduct->getPrice2Detail()
          ];
          break;
        case 'image':
          if (empty($slide_data['image_link'])) {
            $this->slideRepository->deleteSlide($slide);
            throw new Exception('not enough data');
          }
          $image_link = $slide_data['image_link'];
          $slideImage = $this->slideImageRepository->postSlideImage(
            $image_link,
            $slide
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_image',
              $slideImage->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $slide_data = [
            'image_link' => $slideImage->getImageLink(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_image',
              $slideImage->getId()
            )
          ];
          break;

        case 'video':
          if (empty($slide_data['video_link'])) {
            $this->slideRepository->deleteSlide($slide);
            throw new Exception('not enough data');
          }
          $video_link = $slide_data['video_link'];
          $slideVideo = $this->slideVideoRepository->postSlideVideo(
            $video_link,
            $slide
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_video',
              $slideVideo->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $slide_data = [
            'video_link' => $slideVideo->getVideoLink(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_video',
              $slideVideo->getId()
            )
          ];
          break;

        case 'event_image':
          if (empty($slide_data['event_image_id'])) {
            $this->slideRepository->deleteSlide($slide);
            throw new Exception('not enough data');
          }
          $eventImage = $this->eventImageRepository->findOneBy([
            'id' => $slide_data['event_image_id']
          ]);
          $slideEventImage = $this->slideEventImageRepository->postSlideEventImage(
            $eventImage,
            $slide
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_event_image',
              $slideEventImage->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $slide_data = [
            'event_image' => [
              'id' => $slideEventImage->getEventImage()->getId(),
              'image_link' => $slideEventImage->getEventImage()->getImageLink(),
              'event' => [
                'id' => $slideEventImage
                  ->getEventImage()
                  ->getEvent()
                  ->getId(),
                'name' => $slideEventImage
                  ->getEventImage()
                  ->getEvent()
                  ->getName()
              ]
            ],
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_event_image',
              $slideEventImage->getId()
            )
          ];
          break;
        default:
          $this->slideRepository->deleteSlide($slide);
          throw new Exception(
            'type should be one of {"product","image","video","event_image"}'
          );
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $slide->getId(),
            'type' => $slide->getType(),
            'number' => $slide->getNumber(),
            'disabled' => $slide->getDisabled(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide',
              $slide->getId()
            ),
            'slide_data' => $slide_data,
            'slideshow_id' => $slideshow_id
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
   * @Route("/order", name="post_slide_order", methods={"POST"})
   */
  public function postSlideOrder(
    $uuid,
    $license,
    $slideshow_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id
        ]);
        $this->shop_id = $slideshow->getShop()->getId();
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);
      $slides = $this->slideRepository->findBy(['slideshow' => $slideshow_id]);
      if (count($slides) !== count($data['order'])) {
        throw new Exception('incorrect number of items');
      }
      foreach ($data['order'] as $index => $id) {
        $slide = $this->slideRepository->findOneBy([
          'id' => $id,
          'slideshow' => $slideshow_id
        ]);
        if (empty($slide)) {
          throw new Exception('not found');
        }
        $this->slideRepository->patchSlide($slide, ['number' => $index + 1]);
      }

      return new JsonResponse(
        [
          'status' => 'ok'
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
   * @Route("", name="get_slides", methods={"GET"})
   */
  public function getAllSlides(
    $uuid,
    $license,
    $slideshow_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id
        ]);
        $this->shop_id = $slideshow->getShop()->getId();
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }
      $slides = $this->slideRepository->findBy(
        ['slideshow' => $slideshow_id],
        ['number' => 'ASC']
      );
      $data = [];
      foreach ($slides as $slide) {
        switch ($slide->getType()) {
          case 'product':
            $slideProduct = $this->slideProductRepository->findOneBy([
              'slide' => $slide->getId()
            ]);

            $labels_data = [];

            foreach ($slideProduct->getLabels() as $label) {
              $labels_data[] = [
                'id' => $label->getId(),
                'name' => $label->getName(),
                'image_link' => $label->getImageLink(),
                'category_id' => $label->getCategory()->getId()
              ];
            }

            $slide_data = [
              'product' => [
                'id' => $slideProduct->getProduct()->getId(),
                'title' => $slideProduct->getProduct()->getTitle()
              ],
              'title' => $slideProduct->getTitle(),
              'event' => $slideProduct->getEvent(),
              'country' => $slideProduct->getCountry(),
              'labels' => $labels_data,
              'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
                'slide_product',
                $slideProduct->getId()
              ),
              'price1' => $slideProduct->getPrice1(),
              'price1_detail' => $slideProduct->getPrice1Detail(),
              'price2' => $slideProduct->getPrice2(),
              'price2_detail' => $slideProduct->getPrice2Detail()
            ];
            break;
          case 'image':
            $slideImage = $this->slideImageRepository->findOneBy([
              'slide' => $slide->getId()
            ]);
            $slide_data = [
              'image_link' => $slideImage->getImageLink(),
              'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
                'slide_image',
                $slideImage->getId()
              )
            ];
            break;
          case 'video':
            $slideVideo = $this->slideVideoRepository->findOneBy([
              'slide' => $slide->getId()
            ]);
            $slide_data = [
              'video_link' => $slideVideo->getVideoLink(),
              'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
                'slide_video',
                $slideVideo->getId()
              )
            ];
            break;
          case 'event_image':
            $slideEventImage = $this->slideEventImageRepository->findOneBy([
              'slide' => $slide->getId()
            ]);
            $slide_data = [
              'event_image' => [
                'id' => $slideEventImage->getEventImage()->getId(),
                'image_link' => $slideEventImage
                  ->getEventImage()
                  ->getImageLink(),
                'event' => [
                  'id' => $slideEventImage
                    ->getEventImage()
                    ->getEvent()
                    ->getId(),
                  'name' => $slideEventImage
                    ->getEventImage()
                    ->getEvent()
                    ->getName()
                ]
              ],
              'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
                'slide_event_image',
                $slideEventImage->getId()
              )
            ];
            break;
        }
        $data[] = [
          'id' => $slide->getId(),
          'type' => $slide->getType(),
          'number' => $slide->getNumber(),
          'disabled' => $slide->getDisabled(),
          'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
            'slide',
            $slide->getId()
          ),
          'slide_data' => $slide_data,
          'slideshow_id' => $slideshow_id
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
   * @Route("/{id}", name="get_slide", methods={"GET"})
   */
  public function getSlide(
    $uuid,
    $license,
    $slideshow_id,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id
        ]);
        $this->shop_id = $slideshow->getShop()->getId();
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $slide = $this->slideRepository->findOneBy([
        'id' => $id,
        'slideshow' => $slideshow_id
      ]);

      if (empty($slide)) {
        throw new Exception('not found');
      }

      switch ($slide->getType()) {
        case 'product':
          $slideProduct = $this->slideProductRepository->findOneBy([
            'slide' => $slide->getId()
          ]);

          $labels_data = [];

          foreach ($slideProduct->getLabels() as $label) {
            $labels_data[] = [
              'id' => $label->getId(),
              'name' => $label->getName(),
              'image_link' => $label->getImageLink(),
              'category_id' => $label->getCategory()->getId()
            ];
          }

          $slide_data = [
            'product' => [
              'id' => $slideProduct->getProduct()->getId(),
              'title' => $slideProduct->getProduct()->getTitle()
            ],
            'title' => $slideProduct->getTitle(),
            'event' => $slideProduct->getEvent(),
            'country' => $slideProduct->getCountry(),
            'labels' => $labels_data,
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_product',
              $slideProduct->getId()
            ),
            'price1' => $slideProduct->getPrice1(),
            'price1_detail' => $slideProduct->getPrice1Detail(),
            'price2' => $slideProduct->getPrice2(),
            'price2_detail' => $slideProduct->getPrice2Detail()
          ];
          break;
        case 'image':
          $slideImage = $this->slideImageRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $slide_data = [
            'image_link' => $slideImage->getImageLink(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_image',
              $slideImage->getId()
            )
          ];
          break;
        case 'video':
          $slideVideo = $this->slideVideoRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $slide_data = [
            'video_link' => $slideVideo->getVideoLink(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_video',
              $slideVideo->getId()
            )
          ];
          break;
        case 'event_image':
          $slideEventImage = $this->slideEventImageRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $slide_data = [
            'event_image' => [
              'id' => $slideEventImage->getEventImage()->getId(),
              'image_link' => $slideEventImage->getEventImage()->getImageLink(),
              'event' => [
                'id' => $slideEventImage
                  ->getEventImage()
                  ->getEvent()
                  ->getId(),
                'name' => $slideEventImage
                  ->getEventImage()
                  ->getEvent()
                  ->getName()
              ]
            ],
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_event_image',
              $slideEventImage->getId()
            )
          ];
          break;
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => [
            'id' => $slide->getId(),
            'type' => $slide->getType(),
            'number' => $slide->getNumber(),
            'disabled' => $slide->getDisabled(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide',
              $slide->getId()
            ),
            'slide_data' => $slide_data,
            'slideshow_id' => $slideshow_id
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
   * @Route("/{id}", name="patch_slide", methods={"PATCH"})
   */
  public function patchSlide(
    $uuid,
    $license,
    $slideshow_id,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id
        ]);
        $this->shop_id = $slideshow->getShop()->getId();
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $slide = $this->slideRepository->findOneBy([
        'id' => $id,
        'slideshow' => $slideshow_id
      ]);

      if (empty($slide)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);
      $data['number'] = null;
      $data['type'] = null;

      $this->slideRepository->patchSlide($slide, $data);

      if (array_key_exists('option_values', $data)) {
        $this->optionValueRepository->rewriteOptionValues(
          'slide',
          $slide->getId(),
          [
            $slide
              ->getSlideshow()
              ->getDesign()
              ->getId()
          ],
          $data['option_values']
        );
      }

      $slide_data = $data['slide_data'];

      switch ($slide->getType()) {
        case 'product':
          $slideProduct = $this->slideProductRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          if (empty($slideProduct)) {
            throw new Exception('not found');
          }
          if (!empty($slide_data['product_id'])) {
            $product = $this->productRepository->findOneBy([
              'id' => $slide_data['product_id'],
              'shop' => $this->shop_id
            ]);

            if (!empty($slideshow->getShop()->getCategories())) {
              foreach ($slideshow->getShop()->getCategories() as $category) {
                $this->category_ids[] = $category->getId();
              }
            } else {
              $this->category_ids = null;
            }

            if (empty($product)) {
              $product = $this->productRepository->findOneBy([
                'id' => $slide_data['product_id'],
                'category' => $this->category_ids
              ]);
            }

            if (empty($product)) {
              throw new Exception('not found');
            }

            $slide_data['product'] = $product;
          }

          if (array_key_exists('price1', $slide_data)) {
            if ($slide_data['price1'] === null) {
              $slide_data['price1'] = '';
            }
          }
          if (array_key_exists('price1_detail', $slide_data)) {
            if ($slide_data['price1_detail'] === null) {
              $slide_data['price1_detail'] = '';
            }
          }
          if (array_key_exists('price2', $slide_data)) {
            if ($slide_data['price2'] === null) {
              $slide_data['price2'] = '';
            }
          }
          if (array_key_exists('price2_detail', $slide_data)) {
            if ($slide_data['price2_detail'] === null) {
              $slide_data['price2_detail'] = '';
            }
          }
          if (array_key_exists('title', $slide_data)) {
            if ($slide_data['title'] === null) {
              $slide_data['title'] = '';
            }
          }
          if (array_key_exists('event', $slide_data)) {
            if ($slide_data['event'] === null) {
              $slide_data['event'] = '';
            }
          }
          if (array_key_exists('country', $slide_data)) {
            if ($slide_data['country'] === null) {
              $slide_data['country'] = '';
            }
          }

          $this->slideProductRepository->patchSlideProduct(
            $slideProduct,
            $slide_data
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_product',
              $slideProduct->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $labels = [];
          if (array_key_exists('label_ids', $slide_data)) {
            foreach ($slideProduct->getLabels() as $label) {
              $this->slideProductRepository->deleteSlideProductLabel(
                $slideProduct,
                $label
              );
            }
            foreach ($slide_data['label_ids'] as $label_id) {
              $label = $this->labelRepository->findOneBy([
                'id' => $label_id,
                'category' => $this->category_ids
              ]);
              if (!empty($label)) {
                $this->slideProductRepository->postSlideProductLabel(
                  $slideProduct,
                  $label
                );
              }
            }
          }

          $labels_data = [];

          foreach ($slideProduct->getLabels() as $label) {
            $labels_data[] = [
              'id' => $label->getId(),
              'name' => $label->getName(),
              'image_link' => $label->getImageLink(),
              'category_id' => $label->getCategory()->getId()
            ];
          }

          $slide_data = [
            'product' => [
              'id' => $slideProduct->getProduct()->getId(),
              'title' => $slideProduct->getProduct()->getTitle()
            ],
            'title' => $slideProduct->getTitle(),
            'event' => $slideProduct->getEvent(),
            'country' => $slideProduct->getCountry(),
            'labels' => $labels_data,
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_product',
              $slideProduct->getId()
            ),
            'price1' => $slideProduct->getPrice1(),
            'price1_detail' => $slideProduct->getPrice1Detail(),
            'price2' => $slideProduct->getPrice2(),
            'price2_detail' => $slideProduct->getPrice2Detail()
          ];
          break;
        case 'image':
          $slideImage = $this->slideImageRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          if (empty($slideImage)) {
            throw new Exception('not found');
          }
          $this->slideImageRepository->patchSlideImage(
            $slideImage,
            $slide_data
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_image',
              $slideImage->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $slide_data = [
            'image_link' => $slideImage->getImageLink(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_image',
              $slideImage->getId()
            )
          ];
          break;

        case 'video':
          $slideVideo = $this->slideVideoRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          if (empty($slideVideo)) {
            throw new Exception('not found');
          }

          $this->slideVideoRepository->patchSlideVideo(
            $slideVideo,
            $slide_data
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_video',
              $slideVideo->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $slide_data = [
            'video_link' => $slideVideo->getVideoLink(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_video',
              $slideVideo->getId()
            )
          ];
          break;
        case 'event_image':
          $slideEventImage = $this->slideEventImageRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          if (empty($slideEventImage)) {
            throw new Exception('not found');
          }
          if (empty($slide_data['event_image_id'])) {
            throw new Exception('not enough data');
          }
          $slide_data['eventImage'] = $this->eventImageRepository->findOneBy([
            'id' => $slide_data['event_image_id']
          ]);
          $this->slideEventImageRepository->patchSlideEventImage(
            $slideEventImage,
            $slide_data
          );

          if (array_key_exists('option_values', $slide_data)) {
            $this->optionValueRepository->rewriteOptionValues(
              'slide_event_image',
              $slideEventImage->getId(),
              [
                $slide
                  ->getSlideshow()
                  ->getDesign()
                  ->getId()
              ],
              $slide_data['option_values']
            );
          }

          $slide_data = [
            'event_image' => [
              'id' => $slideEventImage->getEventImage()->getId(),
              'image_link' => $slideEventImage->getEventImage()->getImageLink(),
              'event' => [
                'id' => $slideEventImage
                  ->getEventImage()
                  ->getEvent()
                  ->getId(),
                'name' => $slideEventImage
                  ->getEventImage()
                  ->getEvent()
                  ->getName()
              ]
            ],
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide_event_image',
              $slideEventImage->getId()
            )
          ];
          break;
      }

      return new JsonResponse(
        [
          'status' => 'ok',

          'data' => [
            'id' => $slide->getId(),
            'type' => $slide->getType(),
            'number' => $slide->getNumber(),
            'disabled' => $slide->getDisabled(),
            'option_values' => $this->optionValueRepository->getOptionValuesForEntity(
              'slide',
              $slide->getId()
            ),
            'slide_data' => $slide_data,
            'slideshow_id' => $slideshow_id
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
   * @Route("/{id}", name="delete_slide", methods={"DELETE"})
   */
  public function deleteSlide($uuid, $license, $slideshow_id, $id): JsonResponse
  {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id
        ]);
        $this->shop_id = $slideshow->getShop()->getId();
      } else {
        $slideshow = $this->slideshowRepository->findOneBy([
          'id' => $slideshow_id,
          'shop' => $this->shop_id
        ]);
      }

      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $slide = $this->slideRepository->findOneBy([
        'id' => $id,
        'slideshow' => $slideshow_id
      ]);

      if (empty($slide)) {
        throw new Exception('not found');
      }

      switch ($slide->getType()) {
        case 'product':
          $slideProduct = $this->slideProductRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $this->slideProductRepository->deleteSlideProduct($slideProduct);
          break;
        case 'image':
          $slideImage = $this->slideImageRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $this->slideImageRepository->deleteSlideImage($slideImage);
          break;

        case 'video':
          $slideVideo = $this->slideVideoRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $this->slideVideoRepository->deleteSlideVideo($slideVideo);
          break;
      }

      $this->slideRepository->deleteSlide($slide);

      //reordering after deletion

      $slides = $this->slideRepository->findBy(['slideshow' => $slideshow_id]);
      for (
        $number = $slide->getNumber();
        $number <= count($slides);
        $number++
      ) {
        $slide = $this->slideRepository->findOneBy([
          'number' => $number + 1,
          'slideshow' => $slideshow_id
        ]);
        $this->slideRepository->patchSlide($slide, ['number' => $number]);
      }

      return new JsonResponse(['status' => 'ok']);
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }

  /**
   * @Route("/{slide_id}/labels", name="post_slide_product_label", methods={"POST"})
   */
  public function postSlideProductLabel(
    $uuid,
    $license,
    $slideshow_id,
    $slide_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        throw new Exception('no access');
      }

      $slideshow = $this->slideshowRepository->findOneBy([
        'id' => $slideshow_id,
        'shop' => $this->shop_id
      ]);
      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $slide = $this->slideRepository->findOneBy([
        'id' => $slide_id,
        'slideshow' => $slideshow_id
      ]);
      if (empty($slide)) {
        throw new Exception('not found');
      } elseif ($slide->getType() !== 'product') {
        throw new Exception('invalid slide type');
      }

      $slideProduct = $this->slideProductRepository->findOneBy([
        'slide' => $slide_id
      ]);
      if (empty($slideProduct)) {
        throw new Exception('not found');
      }

      $data = json_decode($request->getContent(), true);

      $id = $data['label_id'];
      if (empty($id)) {
        throw new Exception('not enough data');
      }

      $label = $this->labelRepository->findOneBy([
        'id' => $id,
        'category' => $this->category_ids
      ]);
      if (empty($label)) {
        throw new Exception('not found');
      }

      $this->slideProductRepository->postSlideProductLabel(
        $slideProduct,
        $label
      );

      $labels_data = [];

      foreach ($slideProduct->getLabels() as $label) {
        $labels_data[] = [
          'id' => $label->getId(),
          'name' => $label->getName(),
          'image_link' => $label->getImageLink(),
          'category_id' => $label->getCategory()->getId()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => $labels_data
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
   * @Route("/{slide_id}/labels", name="get_all_slide_product_labels", methods={"GET"})
   */
  public function getAllSlideProductLabels(
    $uuid,
    $license,
    $slideshow_id,
    $slide_id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        throw new Exception('no access');
      }

      $slideshow = $this->slideshowRepository->findOneBy([
        'id' => $slideshow_id,
        'shop' => $this->shop_id
      ]);
      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $slide = $this->slideRepository->findOneBy([
        'id' => $slide_id,
        'slideshow' => $slideshow_id
      ]);
      if (empty($slide)) {
        throw new Exception('not found');
      } elseif ($slide->getType() !== 'product') {
        throw new Exception('invalid slide type');
      }

      $slideProduct = $this->slideProductRepository->findOneBy([
        'slide' => $slide_id
      ]);
      if (empty($slideProduct)) {
        throw new Exception('not found');
      }

      $labels_data = [];

      foreach ($slideProduct->getLabels() as $label) {
        $labels_data[] = [
          'id' => $label->getId(),
          'name' => $label->getName(),
          'image_link' => $label->getImageLink(),
          'category_id' => $label->getCategory()->getId()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => $labels_data
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
   * @Route("/{slide_id}/labels/{id}", name="delete_slide_product_label", methods={"DELETE"})
   */
  public function deleteSlideProductLabel(
    $uuid,
    $license,
    $slideshow_id,
    $slide_id,
    $id,
    Request $request
  ): JsonResponse {
    try {
      $this->checkLicense($uuid, $license);

      if ($this->root) {
        throw new Exception('no access');
      }

      $slideshow = $this->slideshowRepository->findOneBy([
        'id' => $slideshow_id,
        'shop' => $this->shop_id
      ]);
      if (empty($slideshow)) {
        throw new Exception('not found');
      }

      $slide = $this->slideRepository->findOneBy([
        'id' => $slide_id,
        'slideshow' => $slideshow_id
      ]);
      if (empty($slide)) {
        throw new Exception('not found');
      } elseif ($slide->getType() !== 'product') {
        throw new Exception('invalid slide type');
      }

      $slideProduct = $this->slideProductRepository->findOneBy([
        'slide' => $slide_id
      ]);
      if (empty($slideProduct)) {
        throw new Exception('not found');
      }

      $label = $this->labelRepository->findOneBy([
        'id' => $id,
        'category' => $this->category_ids
      ]);
      if (empty($label)) {
        throw new Exception('not found');
      }

      $this->slideProductRepository->deleteSlideProductLabel(
        $slideProduct,
        $label
      );

      $labels_data = [];

      foreach ($slideProduct->getLabels() as $label) {
        $labels_data[] = [
          'id' => $label->getId(),
          'name' => $label->getName(),
          'image_link' => $label->getImageLink(),
          'category_id' => $label->getCategory()->getId()
        ];
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'data' => $labels_data
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
}

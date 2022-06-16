<?php
// src/Controller/LuckyController.php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\SlideshowRepository;
use App\Repository\SlideRepository;
use App\Repository\ShopRepository;
use App\Repository\SlideImageRepository;
use App\Repository\SlideVideoRepository;
use App\Repository\SlideEventImageRepository;
use App\Repository\SlideProductRepository;
use App\Repository\ProductRepository;
use App\Repository\OptionRepository;
use App\Repository\OptionValueRepository;

class IndexController extends AbstractController
{
  public function __construct(
    SlideRepository $slideRepository,
    SlideImageRepository $slideImageRepository,
    SlideVideoRepository $slideVideoRepository,
    SlideProductRepository $slideProductRepository,
    SlideEventImageRepository $slideEventImageRepository,
    SlideshowRepository $slideshowRepository,
    ProductRepository $productRepository,
    OptionRepository $optionRepository,
    OptionValueRepository $optionValueRepository,
    ShopRepository $shopRepository
  ) {
    $this->slideRepository = $slideRepository;
    $this->slideImageRepository = $slideImageRepository;
    $this->slideVideoRepository = $slideVideoRepository;
    $this->slideProductRepository = $slideProductRepository;
    $this->slideEventImageRepository = $slideEventImageRepository;
    $this->slideshowRepository = $slideshowRepository;
    $this->shopRepository = $shopRepository;
    $this->productRepository = $productRepository;
    $this->optionRepository = $optionRepository;
    $this->optionValueRepository = $optionValueRepository;
  }
  public function slideshow(Request $request)
  {
    $query = $request->query->all();
    $uuid = isset($query['uuid']) ? $query['uuid'] : null;
    $slideshow_id = isset($query['slideshow_id'])
      ? $query['slideshow_id']
      : null;
    $shop = $this->shopRepository->findOneBy(['uuid' => $uuid]);
    if (empty($shop)) {
      return $this->render('error.html.twig', [
        'error' => 'invalid uuid'
      ]);
    }
    if ($shop->getDisabled()) {
      return $this->render('error.html.twig', [
        'error' => 'disabled license'
      ]);
    }
    if ($shop->getExpirationDate()->getTimestamp() < time()) {
      return $this->render('error.html.twig', [
        'error' => 'expired license'
      ]);
    }

    $slideshow = $this->slideshowRepository->findOneBy([
      'id' => $slideshow_id,
      'shop' => $shop->getid()
    ]);
    if (empty($slideshow)) {
      return $this->render('error.html.twig', [
        'error' => 'invalid slideshow_id'
      ]);
    }
    if ($slideshow->getDisabled()) {
      return $this->render('error.html.twig', [
        'error' => 'disabled slideshow'
      ]);
    }

    $slides = $this->slideRepository->findBy(
      ['slideshow' => $slideshow_id, 'disabled' => false],
      ['number' => 'ASC']
    );

    if (count($slides) === 0) {
      return $this->render('error.html.twig', [
        'error' => 'no slides found'
      ]);
    }

    foreach ($slides as $slide) {
      switch ($slide->getType()) {
        case 'product':
          $slideProduct = $this->slideProductRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $product = $slideProduct->getProduct();
          $product_data = [
            'title' => $product->getTitle(),
            'media_type' => $product->getMediaType(),
            'media_link' => $product->getMediaLink(),
            'options' => $this->optionValueRepository->getOptionsForRender(
              'product',
              $product->getId(),
              $slideshow
            )
          ];

          $labels_data = [];

          foreach ($slideProduct->getLabels() as $label) {
            $labels_data[] = [
              //'id' => $label->getId(),
              'name' => $label->getName(),
              'image_link' => $label->getImageLink()
              //'category_id' => $label->getCategory()->getId()
            ];
          }

          $price1 = $this->highlightCurrencySymbol($slideProduct->getPrice1());
          $price1_detail = $slideProduct->getPrice1Detail();
          $price2 = $this->highlightCurrencySymbol($slideProduct->getPrice2());
          $price2_detail = $slideProduct->getPrice2Detail();

          $slide_data = [
            'product' => $product_data,
            'title' => $slideProduct->getTitle(),
            'event' => $slideProduct->getEvent(),
            'country' => $slideProduct->getCountry(),
            'labels' => $labels_data,
            'price1' => $price1,
            'price1_detail' => $price1_detail,
            'price2' => $price2,
            'price2_detail' => $price2_detail,
            'options' => $this->optionValueRepository->getOptionsForRender(
              'slide_product',
              $slideProduct->getId(),
              $slideshow
            )
          ];
          break;
        case 'image':
          $slideImage = $this->slideImageRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $slide_data = [
            'image_link' => $slideImage->getImageLink(),
            'options' => $this->optionValueRepository->getOptionsForRender(
              'slide_image',
              $slideImage->getId(),
              $slideshow
            )
          ];
          break;
        case 'video':
          $slideVideo = $this->slideVideoRepository->findOneBy([
            'slide' => $slide->getId()
          ]);
          $slide_data = [
            'video_link' => $slideVideo->getVideoLink(),
            'options' => $this->optionValueRepository->getOptionsForRender(
              'slide_video',
              $slideVideo->getId(),
              $slideshow
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
      $slides_data[] = [
        'type' => $slide->getType(),
        'slide_data' => $slide_data,
        'options' => $this->optionValueRepository->getOptionsForRender(
          'slide',
          $slide->getId(),
          $slideshow
        )
      ];
    }

    $slideshow_data = [
      'speed' => $slideshow->getSpeed(),
      'version' => $slideshow->getVersion(),
      'design' => $slideshow->getDesign()->getMachineName(),
      'parent_design' => $slideshow->getDesign()->getParent(),
      'options' => $this->optionValueRepository->getOptionsForRender(
        'slideshow',
        $slideshow->getId(),
        $slideshow
      ),
      'slides' => $slides_data
    ];
    return $this->render('slideshow.html.twig', [
      'uuid' => $uuid,
      'slideshow_id' => $slideshow_id,
      'slideshow' => $slideshow_data
    ]);
  }

  private function highlightCurrencySymbol($price)
  {
    return preg_replace(
      '/(.*)(\$|€|¥|£|ƒ|₱|₽|฿|₺|₴)(.*)/',
      '$1<b>$2</b>$3',
      $price
    );
  }
}

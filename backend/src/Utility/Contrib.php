<?php

namespace App\Utility;

/*
target_entity :
  - slideshow
  - slide
  - slide_image
  - slide_product
  - slide_video
  - slide_event_image
  - product

type :
  - select
  - multi_select
  - image_link
  - video_link
  - integer
  - double
  - boolean
  - string
*/

class Contrib
{
  public function __construct()
  {
    // Design 1 : "Top view"
    $this->d1 = [
      'machine_name' => 'd1',
      'disabled' => false,
      'options' => [
        [
          'machine_name' => 'overwrite.slide_product.bg_photo',
          'translation_key' => 'bg_photo',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.jpg',
          'supported_values' => $this->nbValues(4, '.jpg'),
          'disabled' => false
        ],
        [
          'machine_name' => 'bg_photo',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.jpg',
          'supported_values' => $this->nbValues(4, '.jpg'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.left',
          'translation_key' => 'left',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'left',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.top_left',
          'translation_key' => 'top_left',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'top_left',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.top_right',
          'translation_key' => 'top_right',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'top_right',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.right',
          'translation_key' => 'right',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'right',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.bottom',
          'translation_key' => 'bottom',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'bottom',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.png',
          'supported_values' => $this->nbValues(4, '.png'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.theme_color',
          'translation_key' => 'theme_color',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => 'burgundy_yellow',
          'supported_values' => [
            'burgundy_yellow',
          ],
          'disabled' => false
        ],
        [
          'machine_name' => 'theme_color',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => 'burgundy_yellow',
          'supported_values' => [
            'burgundy_yellow',
          ],
          'disabled' => false
        ],
      ]
    ];

    // Design 2 : "HMarket"
    $this->d2 = [
      'machine_name' => 'd2',
      'disabled' => false,
      'options' => [
        [
          'machine_name' => 'overwrite.slide_product.bg_photo',
          'translation_key' => 'bg_photo',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '',
          'supported_values' => $this->nbValues(6, '.jpg'),
          'disabled' => false
        ],
        [
          'machine_name' => 'bg_photo',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '',
          'supported_values' => $this->nbValues(6, '.jpg'),
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.theme_color',
          'translation_key' => 'theme_color',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => 'brown1',
          'supported_values' => [
            'blue1',
            'blue2',
            'brown1',
            'brown2',
            'brown3',
            'green1',
            'green2',
            'red1',
            'yellow1',
            'yellow2',
            'yellow3'
          ],
          'disabled' => false
        ],
        [
          'machine_name' => 'theme_color',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => 'brown1',
          'supported_values' => [
            'blue1',
            'blue2',
            'brown1',
            'brown2',
            'brown3',
            'green1',
            'green2',
            'red1',
            'yellow1',
            'yellow2',
            'yellow3'
          ],
          'disabled' => false
        ],
        [
          'machine_name' => 'overwrite.slide_product.table',
          'translation_key' => 'table',
          'target_entity' => 'slideshow',
          'type' => 'select',
          'default_value' => '1.jpg',
          'supported_values' => $this->nbValues(6, '.jpg'),
          'disabled' => false
        ],
        [
          'machine_name' => 'table',
          'target_entity' => 'slide_product',
          'type' => 'select',
          'default_value' => '1.jpg',
          'supported_values' => $this->nbValues(6, '.jpg'),
          'disabled' => false
        ]
      ]
    ];

    // Design 3 : former default design (First design from Lea)
    $this->d3 = [
      'machine_name' => 'd3',
      'disabled' => false,
      'options' => []
    ];
  }

  public function getContrib()
  {
    $contrib = [
      'design' => [$this->d1, $this->d2, $this->d3]
    ];

    return $contrib;
  }

  private function createChildDesign(
    $design,
    $child_design_machine_name,
    $new_options,
    $overwrite_options
  ) {
    $design['parent'] = $design['machine_name'];
    $design['machine_name'] = $child_design_machine_name;

    foreach ($overwrite_options as $overwrite_option) {
      foreach ($design['options'] as $index => $option) {
        if ($option['machine_name'] === $overwrite_option['machine_name']) {
          $design['options'][$index] = $overwrite_option;
        }
      }
    }

    $design['options'] = array_merge($design['options'], $new_options);

    return $design;
  }

  private function nbValues($to, $suffix = '')
  {
    return array_map(function ($v) use ($suffix) {
      return $v . $suffix;
    }, range(1, $to));
  }
}

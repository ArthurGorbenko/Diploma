<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
//use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

//use const App\Utility\CONTRIB;
use App\Utility\Contrib;

use Symfony\Component\Config\Definition\Exception\Exception;

use App\Entity\Design;
use App\Repository\DesignRepository;
use App\Repository\OptionRepository;
use App\Repository\OptionValueRepository;
use App\Repository\SlideshowRepository;
use App\Repository\ProductRepository;
use App\Repository\SlideProductRepository;
use App\Repository\SlideImageRepository;
use App\Repository\SlideVideoRepository;
use App\Repository\SlideEventImageRepository;

class ContribCommand extends Command
{
  private $designRepository;
  private $optionRepository;
  private $optionValueRepository;
  private $slideshowRepository;
  private $productRepository;
  private $slideProductRepository;
  private $slideImageRepository;
  private $slideVideoRepository;
  private $slideEventImageRepository;
  private $contrib;
  public function __construct(
    DesignRepository $designRepository,
    OptionRepository $optionRepository,
    OptionValueRepository $optionValueRepository,
    SlideshowRepository $slideshowRepository,
    ProductRepository $productRepository,
    SlideProductRepository $slideProductRepository,
    SlideImageRepository $slideImageRepository,
    SlideVideoRepository $slideVideoRepository,
    SlideEventImageRepository $slideEventImageRepository,
    Contrib $contrib
  ) {
    $this->designRepository = $designRepository;
    $this->optionRepository = $optionRepository;
    $this->slideshowRepository = $slideshowRepository;
    $this->optionValueRepository = $optionValueRepository;
    $this->productRepository = $productRepository;
    $this->slideProductRepository = $slideProductRepository;
    $this->slideImageRepository = $slideImageRepository;
    $this->slideVideoRepository = $slideVideoRepository;
    $this->slideEventImageRepository = $slideEventImageRepository;
    $this->contrib = $contrib->getContrib();

    parent::__construct();
  }

  protected static $defaultName = 'app:contrib';

  protected function configure()
  {
    $this->setDescription('Update contrib data in db');
  }

  private $entity_structure = [
    'design' => [
      'machine_name' => 'string',
      'disabled' => 'boolean',
      'options' => [
        'machine_name' => 'string',
        'translation_key' => 'string',
        'target_entity' => 'string',
        'type' => 'string',
        //'default_value' => 'type',
        'default_value' => 'string',
        'supported_values' => 'array',
        'disabled' => 'boolean'
      ]
    ]
  ];

  protected function execute(
    InputInterface $input,
    OutputInterface $output
  ): int {
    $this->io = new SymfonyStyle($input, $output);

    try {
      $this->validate();

      foreach ($this->contrib as $entity_name => $entity_data) {
        if ($entity_name === 'design') {
          // getting data into arrays
          $this->io->text('Getting diffs for entity "' . $entity_name . '"...');
          $design_machine_names_stored = [];
          $options_stored = [];
          foreach ($this->designRepository->findAll() as $design) {
            $design_machine_names_stored[] = $design->getMachineName();
            foreach ($design->getOptions() as $option) {
              $options_stored[$design->getMachineName()][] = [
                'machine_name' => $option->getMachineName(),
                'translation_key' => $option->getTranslationKey(),
                'default_value' => $option->getDefaultValue()[0],
                'supported_values' => $option->getSupportedValues()
              ];
            }
          }
          //var_dump($options_stored);

          $design_machine_names_contrib = [];
          $options_contrib = [];
          foreach ($entity_data as $row) {
            $design_machine_names_contrib[] = $row['machine_name'];
            $options_contrib[$row['machine_name']] = [];
            foreach ($row['options'] as $option) {
              if (empty($option['translation_key'])) {
                $option['translation_key'] = $option['machine_name'];
              }
              $options_contrib[$row['machine_name']][] = $option;
            }
          }
          //var_dump($options_contrib);
          // TEMP
          //foreach ($options_contrib as $design_machine_name => $options) {
          //  $design = $this->designRepository->findBy([
          //    'machine_name' => $design_machine_name
          //  ]);
          //
          //  foreach ($options as $option_data) {
          //    $this->optionRepository->postOption(
          //      $design[0],
          //      $option_data['machine_name'],
          //      $option_data['translation_key'],
          //      $option_data['target_entity'],
          //      $option_data['type'],
          //      $option_data['disabled'],
          //      [$option_data['default_value']],
          //      $option_data['supported_values']
          //    );
          //  }
          //}

          //var_dump($design_machine_names_stored);
          //var_dump($design_machine_names_contrib);

          // get diffs
          $design_machine_names_to_remove = array_diff(
            $design_machine_names_stored,
            $design_machine_names_contrib
          );
          $design_machine_names_to_add = array_diff(
            $design_machine_names_contrib,
            $design_machine_names_stored
          );

          $option_machine_names_to_remove = [];
          foreach ($design_machine_names_to_remove as $design_machine_name) {
            if (!array_key_exists($design_machine_name, $options_stored)) {
              continue;
            }
            $option_machine_names_to_remove[$design_machine_name] = [];
            foreach ($options_stored[$design_machine_name] as $option) {
              $option_machine_names_to_remove[$design_machine_name][] =
                $option['machine_name'];
            }
          }
          foreach (
            $options_stored
            as $design_stored => $design_options_stored
          ) {
            if (in_array($design_stored, $design_machine_names_to_remove)) {
              continue;
            }

            $option_machine_names_to_remove[$design_stored] = [];
            foreach ($design_options_stored as $option_stored) {
              if (
                array_search(
                  $option_stored['machine_name'],
                  array_column($options_contrib[$design_stored], 'machine_name')
                ) === false
              ) {
                $option_machine_names_to_remove[$design_stored][] =
                  $option_stored['machine_name'];
              }
            }
          }

          $options_to_add = [];
          foreach (
            $options_contrib
            as $design_contrib => $design_options_contrib
          ) {
            foreach ($design_options_contrib as $option_contrib) {
              if (
                !array_key_exists($design_contrib, $options_stored) ||
                array_search(
                  $option_contrib['machine_name'],
                  array_column($options_stored[$design_contrib], 'machine_name')
                ) === false
              ) {
                $options_to_add[$design_contrib][] = $option_contrib;
              }
            }
          }

          $options_to_update = [];
          foreach (
            $options_stored
            as $design_stored => $design_options_stored
          ) {
            foreach ($design_options_stored as $option_stored) {
              if (
                !in_array(
                  $option_stored['machine_name'],
                  $option_machine_names_to_remove[$design_stored]
                )
              ) {
                //var_dump($option_stored);
                //$option_contrib=
                $index_contrib = array_search(
                  $option_stored['machine_name'],
                  array_column($options_contrib[$design_stored], 'machine_name')
                );
                if ($index_contrib === false) {
                  throw new Exception('Internal error.');
                }

                $option_contrib =
                  $options_contrib[$design_stored][$index_contrib];
                if (
                  $option_stored['translation_key'] !==
                    $option_contrib['translation_key'] ||
                  $option_stored['default_value'] !==
                    $option_contrib['default_value'] ||
                  $option_stored['supported_values'] !==
                    $option_contrib['supported_values']
                ) {
                  $options_to_update[$design_stored][] = $option_contrib;
                }
              }
            }
          }

          //var_dump($options_to_update);
          //var_dump($option_machine_names_to_remove);
          //var_dump($options_to_add);
          //var_dump($design_machine_names_to_remove);
          //var_dump($design_machine_names_to_add);
          $this->io->text('OK');
          $this->io->newLine();

          $no_options_to_remove = true;
          foreach (
            $option_machine_names_to_remove
            as $design_machine_name => $option_machine_names
          ) {
            if (!empty($option_machine_names)) {
              $this->io->text(
                count($option_machine_names) .
                  " options to remove for design '$design_machine_name'"
              );
              $no_options_to_remove = false;
            }
          }
          if ($no_options_to_remove) {
            $this->io->text('0 options to remove');
          }

          $this->io->text(
            count($design_machine_names_to_remove) . ' designs to remove'
          );

          if (empty($options_to_update)) {
            $this->io->text('0 options to update');
          } else {
            foreach ($options_to_update as $design_machine_name => $options) {
              $this->io->text(
                count($options) .
                  " options to update for design '$design_machine_name'"
              );
            }
          }

          $this->io->text(
            count($design_machine_names_to_add) . ' designs to add'
          );

          if (empty($options_to_add)) {
            $this->io->text('0 options to add');
          } else {
            foreach ($options_to_add as $design_machine_name => $options) {
              $this->io->text(
                count($options) .
                  " options to add for design '$design_machine_name'"
              );
            }
          }

          $this->io->newLine();

          // apply deletions to options
          if (!$no_options_to_remove) {
            if (
              !$this->io->confirm(
                'Please confirm you want to delete option(s)?',
                false
              )
            ) {
              $this->io->text('Skipping the deletion of options.');
            } else {
              $count = 0;
              foreach (
                $option_machine_names_to_remove
                as $design_machine_name => $option_machine_names
              ) {
                foreach ($option_machine_names as $option_machine_name) {
                  $design = $this->designRepository->findBy([
                    'machine_name' => $design_machine_name
                  ]);
                  $option = $this->optionRepository->findBy([
                    'machine_name' => $option_machine_name,
                    'design' => $design[0]->getId()
                  ]);
                  $this->optionRepository->deleteOption($option[0]);
                  $count++;
                }
              }
              if ($count > 0) {
                $this->io->text($count . ' options removed');
              }
            }
          }

          // apply deletions to designs
          if ($design_machine_names_to_remove) {
            if (
              !$this->io->confirm(
                'Please confirm you want to delete design(s)?',
                false
              )
            ) {
              $this->io->text('Skipping the deletion of designs.');
            } else {
              foreach (
                $this->designRepository->findBy([
                  'machine_name' => $design_machine_names_to_remove
                ])
                as $design
              ) {
                $this->designRepository->deleteDesign($design);
              }
              $this->io->text(
                count($design_machine_names_to_remove) . ' designs removed'
              );
            }
          }

          // apply updates to options
          $count = 0;
          foreach ($options_to_update as $design_machine_name => $options) {
            foreach ($options as $option_data) {
              $design = $this->designRepository->findBy([
                'machine_name' => $design_machine_name
              ]);
              $option = $this->optionRepository->findBy([
                'machine_name' => $option_data['machine_name'],
                'design' => $design[0]->getId()
              ]);

              // force deafult value on entities with no default value when changing default value
              if (
                $option[0]->getDefaultValue() !== [
                  $option_data['default_value']
                ]
              ) {
                switch ($option[0]->getTargetEntity()) {
                  case 'slideshow':
                    $slideshows = $this->slideshowRepository->findBy([
                      'design' => $design[0]->getId()
                    ]);
                    foreach ($slideshows as $slideshow) {
                      $option_value = $this->optionValueRepository->findBy([
                        'referred_option' => $option[0]->getId(),
                        'target_entity_type' => $option[0]->getTargetEntity(),
                        'target_entity_id' => $slideshow->getId()
                      ]);
                      if (empty($option_value)) {
                        $this->optionValueRepository->postOptionValue(
                          $option[0],
                          $option[0]->getTargetEntity(),
                          $slideshow->getId(),
                          $option[0]->getDefaultValue()[0]
                        );
                      }
                    }
                    break;

                  case 'slide':
                    $slideshows = $this->slideshowRepository->findBy([
                      'design' => $design[0]->getId()
                    ]);
                    $slides = [];
                    foreach ($slideshows as $slideshow) {
                      $slides = array_merge(
                        $slideshow->getSlides()->toArray(),
                        $slides
                      );
                    }
                    foreach ($slides as $slide) {
                      $option_value = $this->optionValueRepository->findBy([
                        'referred_option' => $option[0]->getId(),
                        'target_entity_type' => $option[0]->getTargetEntity(),
                        'target_entity_id' => $slide->getId()
                      ]);
                      if (empty($option_value)) {
                        $this->optionValueRepository->postOptionValue(
                          $option[0],
                          $option[0]->getTargetEntity(),
                          $slide->getId(),
                          $option[0]->getDefaultValue()[0]
                        );
                      }
                    }
                    break;
                  case 'slide_product':
                    $slideshows = $this->slideshowRepository->findBy([
                      'design' => $design[0]->getId()
                    ]);
                    $slides = [];
                    foreach ($slideshows as $slideshow) {
                      $slides = array_merge(
                        $slideshow->getSlides()->toArray(),
                        $slides
                      );
                    }
                    foreach ($slides as $slide) {
                      if ($slide->getType() === 'product') {
                        $slideProduct = $this->slideProductRepository->findOneBy(
                          [
                            'slide' => $slide->getId()
                          ]
                        );
                        $option_value = $this->optionValueRepository->findBy([
                          'referred_option' => $option[0]->getId(),
                          'target_entity_type' => $option[0]->getTargetEntity(),
                          'target_entity_id' => $slideProduct->getId()
                        ]);
                        if (empty($option_value)) {
                          $this->optionValueRepository->postOptionValue(
                            $option[0],
                            $option[0]->getTargetEntity(),
                            $slideProduct->getId(),
                            $option[0]->getDefaultValue()[0]
                          );
                        }
                      }
                    }
                    break;
                  case 'slide_image':
                    $slideshows = $this->slideshowRepository->findBy([
                      'design' => $design[0]->getId()
                    ]);
                    $slides = [];
                    foreach ($slideshows as $slideshow) {
                      $slides = array_merge(
                        $slideshow->getSlides()->toArray(),
                        $slides
                      );
                    }
                    foreach ($slides as $slide) {
                      if ($slide->getType() === 'image') {
                        $slideImage = $this->slideImageRepository->findOneBy([
                          'slide' => $slide->getId()
                        ]);
                        $option_value = $this->optionValueRepository->findBy([
                          'referred_option' => $option[0]->getId(),
                          'target_entity_type' => $option[0]->getTargetEntity(),
                          'target_entity_id' => $slideImage->getId()
                        ]);
                        if (empty($option_value)) {
                          $this->optionValueRepository->postOptionValue(
                            $option[0],
                            $option[0]->getTargetEntity(),
                            $slideImage->getId(),
                            $option[0]->getDefaultValue()[0]
                          );
                        }
                      }
                    }
                    break;
                  case 'slide_video':
                    $slideshows = $this->slideshowRepository->findBy([
                      'design' => $design[0]->getId()
                    ]);
                    $slides = [];
                    foreach ($slideshows as $slideshow) {
                      $slides = array_merge(
                        $slideshow->getSlides()->toArray(),
                        $slides
                      );
                    }
                    foreach ($slides as $slide) {
                      if ($slide->getType() === 'video') {
                        $slideVideo = $this->slideVideoRepository->findOneBy([
                          'slide' => $slide->getId()
                        ]);
                        $option_value = $this->optionValueRepository->findBy([
                          'referred_option' => $option[0]->getId(),
                          'target_entity_type' => $option[0]->getTargetEntity(),
                          'target_entity_id' => $slideVideo->getId()
                        ]);
                        if (empty($option_value)) {
                          $this->optionValueRepository->postOptionValue(
                            $option[0],
                            $option[0]->getTargetEntity(),
                            $slideVideo->getId(),
                            $option[0]->getDefaultValue()[0]
                          );
                        }
                      }
                    }
                    break;
                  case 'slide_event_image':
                    $slideshows = $this->slideshowRepository->findBy([
                      'design' => $design[0]->getId()
                    ]);
                    $slides = [];
                    foreach ($slideshows as $slideshow) {
                      $slides = array_merge(
                        $slideshow->getSlides()->toArray(),
                        $slides
                      );
                    }
                    foreach ($slides as $slide) {
                      if ($slide->getType() === 'event_image') {
                        $slideEventImage = $this->slideEventImageRepository->findOneBy(
                          [
                            'slide' => $slide->getId()
                          ]
                        );
                        $option_value = $this->optionValueRepository->findBy([
                          'referred_option' => $option[0]->getId(),
                          'target_entity_type' => $option[0]->getTargetEntity(),
                          'target_entity_id' => $slideEventImage->getId()
                        ]);
                        if (empty($option_value)) {
                          $this->optionValueRepository->postOptionValue(
                            $option[0],
                            $option[0]->getTargetEntity(),
                            $slideEventImage->getId(),
                            $option[0]->getDefaultValue()[0]
                          );
                        }
                      }
                    }
                    break;
                  case 'product':
                    $products = $design[0]->getProducts();
                    foreach ($products as $product) {
                      $option_value = $this->optionValueRepository->findBy([
                        'referred_option' => $option[0]->getId(),
                        'target_entity_type' => $option[0]->getTargetEntity(),
                        'target_entity_id' => $product->getId()
                      ]);
                      if (empty($option_value)) {
                        $this->optionValueRepository->postOptionValue(
                          $option[0],
                          $option[0]->getTargetEntity(),
                          $product->getId(),
                          $option[0]->getDefaultValue()[0]
                        );
                      }
                    }
                    break;
                }
              }

              $option = $this->optionRepository->patchOption($option[0], [
                'translation_key' => $option_data['translation_key'],
                'default_value' => [$option_data['default_value']],
                'supported_values' => $option_data['supported_values']
              ]);
              $count++;
            }
          }
          if ($count > 0) {
            $this->io->text($count . ' options updated');
          }

          // apply design additions
          if ($design_machine_names_to_add) {
            foreach ($design_machine_names_to_add as $machine_name) {
              $index = array_search(
                $machine_name,
                array_column($this->contrib['design'], 'machine_name')
              );
              $row = $this->contrib['design'][$index];
              $this->designRepository->postDesign(
                $row['machine_name'],
                $row['parent'] ?? '',
                $row['disabled']
              );
            }
            $this->io->text(
              count($design_machine_names_to_add) . ' designs added'
            );
          }

          // apply option additions
          $count = 0;
          foreach ($options_to_add as $design_machine_name => $options) {
            foreach ($options as $option_data) {
              $design = $this->designRepository->findBy([
                'machine_name' => $design_machine_name
              ]);
              $this->optionRepository->postOption(
                $design[0],
                $option_data['machine_name'],
                $option_data['translation_key'],
                $option_data['target_entity'],
                $option_data['type'],
                $option_data['disabled'],
                [$option_data['default_value']],
                $option_data['supported_values']
              );
              $count++;
            }
          }
          if ($count > 0) {
            $this->io->text($count . ' options added');
          }
        }
      }

      $this->io->success('Done!');
    } catch (Exception $e) {
      $this->io->error($e->getMessage());
    }

    return 0;
  }

  protected function validateArray($target_array, $target_structure)
  {
    foreach (
      $target_array
      as $target_array_element_index => $target_array_element
    ) {
      foreach (
        $target_structure
        as $target_structure_field_name => $target_structure_field_type
      ) {
        if (
          array_key_exists(
            $target_structure_field_name,
            $target_array_element
          ) ||
          $target_structure_field_name === 'translation_key'
        ) {
          if (gettype($target_structure_field_type) !== 'array') {
            $target_array_element_field_type =
              $target_structure_field_name !== 'translation_key'
                ? gettype($target_array_element[$target_structure_field_name])
                : 'string';

            if ($target_structure_field_name === 'default_value') {
              switch ($target_array_element['type']) {
                case 'select':
                case 'multi_select':
                case 'image_link':
                case 'video_link':
                  $expected_type = 'string';
                  break;

                default:
                  $expected_type = $target_array_element['type'];
              }

              if ($target_array_element_field_type !== $expected_type) {
                $this->throwWrongTypeException(
                  $target_structure_field_name,
                  $target_array_element_index,
                  $expected_type,
                  $target_array_element_field_type
                );
              }
            } elseif ($target_structure_field_name === 'supported_values') {
              if (
                $target_array_element['type'] === 'select' ||
                $target_array_element['type'] === 'multi_select'
              ) {
                if (
                  $target_array_element_field_type !==
                  $target_structure_field_type
                ) {
                  $this->throwWrongTypeException(
                    $target_structure_field_name,
                    $target_array_element_index,
                    $target_structure_field_type,
                    $target_array_element_field_type
                  );
                }

                $expected_type = 'string';
                foreach (
                  $target_array_element[$target_structure_field_name]
                  as $value
                ) {
                  $target_array_element_field_type = gettype($value);
                  if ($target_array_element_field_type !== $expected_type) {
                    $this->throwWrongTypeException(
                      $target_structure_field_name,
                      $target_array_element_index,
                      $expected_type,
                      $target_array_element_field_type
                    );
                  }
                }
              }
            } else {
              if (
                $target_array_element_field_type !==
                $target_structure_field_type
              ) {
                $this->throwWrongTypeException(
                  $target_structure_field_name,
                  $target_array_element_index,
                  $target_structure_field_type,
                  $target_array_element_field_type
                );
              }
            }

            //  switch ($target_structure_field_name) {
            //    case "default_value":
            //      if (
            //        $target_array_element_field_type !==
            //        $target_array_element['type']
            //      ) {
            //        $expected_type = $target_array_element['type'];
            //        throw new Exception(
            //          "Wrong type for field '$target_structure_field_name' for element with index $target_array_element_index. Expected '$expected_type', but got '$target_array_element_field_type' instead."
            //        );
            //      }
            //      break;
            //    default:

            //elseif (
            //  $target_structure_field_name === 'supported_values' &&
            //  ($target_array_element['type'] === 'select' ||
            //    $target_array_element['type'] === 'multi_select')
            //) {
            //  foreach (
            //    $target_array_element[$target_structure_field_name]
            //    as $value
            //  ) {
            //    if (gettype($value) !== $target_array_element['type']) {
            //      $expected_type = $target_array_element['type'];
            //      throw new Exception(
            //        "Wrong type for field '$target_structure_field_name' for element with index $target_array_element_index. Expected '$expected_type', but got '$target_array_element_field_type' instead."
            //      );
            //    }
            //  }
            //}
            //  }
          } else {
            try {
              $this->validateArray(
                $target_array_element[$target_structure_field_name],
                $target_structure_field_type
              );
            } catch (Exception $e) {
              $this->io->error($e->getMessage());
              throw new Exception(
                "Error occured while validating '$target_structure_field_name' for element with index $target_array_element_index."
              );
            }
          }
        } else {
          throw new Exception(
            "Missing key '$target_structure_field_name' for element with index $target_array_element_index."
          );
        }
      }
    }
  }

  protected function throwWrongTypeException(
    $field_name,
    $index,
    $expected_type,
    $recieved_type
  ) {
    throw new Exception(
      "Wrong type for field '$field_name' for element with index $index. Expected '$expected_type', but got '$recieved_type' instead."
    );
  }

  protected function validate()
  {
    foreach ($this->contrib as $entity_name => $entity_data) {
      $this->io->text("Running validation for entity $entity_name...");
      try {
        $this->validateArray(
          $entity_data,
          $this->entity_structure[$entity_name]
        );
        $this->io->text('OK');
      } catch (Exception $e) {
        $this->io->error($e->getMessage());
        throw new Exception("Error occured while validating '$entity_name'.");
      }
    }
    $this->io->newLine();
  }
}

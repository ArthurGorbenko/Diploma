# Contributions script instructions

## Introduction

TODO

## Running script

```bash
bin/console app:contrib
```

TODO more info here maybe

## Editing contrib file

TODO info about file location etc

### File structure

TODO

### Helper functions

TODO

#### createChildDesign

`createChildDesign` - create associative array for a child design

##### Description

```php
createChildDesign(
  array $parent_design,
  string $child_design_machine_name
  [, array $new_options = []
    [, array $overwrite_options = []]
  ]
)
```

Replaces the `machine_name` of `$parent_design` with `$child_design_machine_name` and moves the old machine name to the value under `parent` key. Appends `$new_options` to the array under `options` key. Rewrites parent design's options with options from `$overwrite_options` if the machine names match.

##### Parameters

`parent_design` - associative array that will be used as a parent.

`child_design_machine_name` - machine name for new design,

`new_options` - array with options specific to child design,

`overwrite_options` - array with options that will overwrite parent options if their machine names match.

##### Return values

`createChildDesign` returnes associative array with new child design

##### Example

Call the function like this. Preferebly in constructor.

```php
$this->d3_EXTENDED_EXAMPLE = $this->createChildDesign(
  $this::d3,
  'd3_EXTENDED_EXAMPLE',
  [
    [
      'machine_name' => 'NEW_OPTION_FOR_EXTENDED_DESIGN_EXAMPLE',
      'target_entity' => 'slide_product',
      'type' => 'string',
      'default_value' => 'STRING!@#',
      'supported_values' => [],
      'disabled' => false
    ]
  ],
  [
    [
      'machine_name' => 'overwrite.slide_product.bg_img',
      'translation_key' => 'bg_text_color',
      'target_entity' => 'slideshow',
      'type' => 'select',
      'default_value' => '#333',
      'supported_values' => ['#E20209', '#333', '#000'],
      'disabled' => false
    ],
    [
      'machine_name' => 'bg_text_color',
      'target_entity' => 'slide_product',
      'type' => 'select',
      'default_value' => '#333',
      'supported_values' => ['#E20209', '#333', '#000'],
      'disabled' => false
    ]
  ]
);
```

You can later insert that design into final array like this:

```php
...
$this::d3,
$this->d3_EXTENDED_EXAMPLE
...
```

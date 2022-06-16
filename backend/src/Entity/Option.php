<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OptionRepository")
 * @ORM\Table(name="`option`")
 */
class Option
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Design", inversedBy="options")
   * @ORM\JoinColumn(nullable=false)
   */
  private $design;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $machine_name;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $target_entity;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $type;

  /**
   * @ORM\Column(type="boolean")
   */
  private $disabled;

  /**
   * @ORM\Column(type="json")
   */
  private $default_value = [];

  /**
   * @ORM\Column(type="json")
   */
  private $supported_values = [];

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $translation_key;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getDesign(): ?Design
  {
    return $this->design;
  }

  public function setDesign(?Design $design): self
  {
    $this->design = $design;

    return $this;
  }

  public function getMachineName(): ?string
  {
    return $this->machine_name;
  }

  public function setMachineName(string $machine_name): self
  {
    $this->machine_name = $machine_name;

    return $this;
  }

  public function getTargetEntity(): ?string
  {
    return $this->target_entity;
  }

  public function setTargetEntity(string $target_entity): self
  {
    $this->target_entity = $target_entity;

    return $this;
  }

  public function getType(): ?string
  {
    return $this->type;
  }

  public function setType(string $type): self
  {
    $this->type = $type;

    return $this;
  }

  public function getDisabled(): ?bool
  {
    return $this->disabled;
  }

  public function setDisabled(bool $disabled): self
  {
    $this->disabled = $disabled;

    return $this;
  }

  public function getDefaultValue(): ?array
  {
    return $this->default_value;
  }

  public function setDefaultValue(array $default_value): self
  {
    $this->default_value = $default_value;

    return $this;
  }

  public function getSupportedValues(): ?array
  {
    return $this->supported_values;
  }

  public function setSupportedValues(array $supported_values): self
  {
    $this->supported_values = $supported_values;

    return $this;
  }

  public function getTranslationKey(): ?string
  {
    return $this->translation_key;
  }

  public function setTranslationKey(string $translation_key): self
  {
    $this->translation_key = $translation_key;

    return $this;
  }
}

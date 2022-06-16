<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OptionValueRepository")
 */
class OptionValue
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Option")
   * @ORM\JoinColumn(nullable=false,onDelete="CASCADE")
   */
  private $referred_option;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $target_entity_type;

  /**
   * @ORM\Column(type="integer")
   */
  private $target_entity_id;

  /**
   * @ORM\Column(type="json")
   */
  private $value = [];

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getReferredOption(): ?Option
  {
    return $this->referred_option;
  }

  public function setReferredOption(?Option $referred_option): self
  {
    $this->referred_option = $referred_option;

    return $this;
  }

  public function getTargetEntityType(): ?string
  {
    return $this->target_entity_type;
  }

  public function setTargetEntityType(string $target_entity_type): self
  {
    $this->target_entity_type = $target_entity_type;

    return $this;
  }

  public function getTargetEntityId(): ?int
  {
    return $this->target_entity_id;
  }

  public function setTargetEntityId(int $target_entity_id): self
  {
    $this->target_entity_id = $target_entity_id;

    return $this;
  }

  public function getValue(): ?array
  {
    return $this->value;
  }

  public function setValue(array $value): self
  {
    $this->value = $value;

    return $this;
  }
}

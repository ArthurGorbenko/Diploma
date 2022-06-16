<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LabelRepository")
 */
class Label
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $name;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $image_link;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Category")
   * @ORM\JoinColumn(nullable=false)
   */
  private $category;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getName(): ?string
  {
    return $this->name;
  }

  public function setName(string $name): self
  {
    $this->name = $name;

    return $this;
  }

  public function getImageLink(): ?string
  {
    return $this->image_link;
  }

  public function setImageLink(string $image_link): self
  {
    $this->image_link = $image_link;

    return $this;
  }

  public function getCategory(): ?Category
  {
    return $this->category;
  }

  public function setCategory(?Category $category): self
  {
    $this->category = $category;

    return $this;
  }
}

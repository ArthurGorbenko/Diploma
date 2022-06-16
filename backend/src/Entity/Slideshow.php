<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SlideshowRepository")
 */
class Slideshow
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
   * @ORM\Column(type="integer")
   */
  private $speed;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Shop")
   * @ORM\JoinColumn(nullable=false)
   */
  private $shop;

  /**
   * @ORM\Column(type="boolean")
   */
  private $disabled;

  /**
   * @ORM\Column(type="integer")
   */
  private $version;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Category")
   */
  private $categories;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Design")
   */
  private $design;

  /**
   * @ORM\OneToMany(targetEntity="App\Entity\Slide", mappedBy="slideshow")
   */
  private $slides;

  public function __construct()
  {
    $this->categories = new ArrayCollection();
    $this->slides = new ArrayCollection();
  }

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

  public function getSpeed(): ?int
  {
    return $this->speed;
  }

  public function setSpeed(int $speed): self
  {
    $this->speed = $speed;

    return $this;
  }

  public function getShop(): ?Shop
  {
    return $this->shop;
  }

  public function setShop(?Shop $shop): self
  {
    $this->shop = $shop;

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

  public function getVersion(): ?int
  {
    return $this->version;
  }

  public function setVersion(int $version): self
  {
    $this->version = $version;

    return $this;
  }

  /**
   * @return Collection|Slide[]
   */
  public function getSlides(): Collection
  {
    return $this->slides;
  }

  /**
   * @return Collection|Category[]
   */
  public function getCategories(): Collection
  {
    return $this->categories;
  }

  public function addCategory(Category $category): self
  {
    if (!$this->categories->contains($category)) {
      $this->categories[] = $category;
    }

    return $this;
  }

  public function removeCategory(Category $category): self
  {
    if ($this->categories->contains($category)) {
      $this->categories->removeElement($category);
    }

    return $this;
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
}

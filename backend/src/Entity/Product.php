<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 */
class Product
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
  private $title;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $media_type;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $media_link;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Shop")
   */
  private $shop;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Category")
   */
  private $category;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Design", inversedBy="products")
   */
  private $designs;

  public function __construct()
  {
    $this->designs = new ArrayCollection();
  }

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getTitle(): ?string
  {
    return $this->title;
  }

  public function setTitle(string $title): self
  {
    $this->title = $title;

    return $this;
  }

  public function getMediaType(): ?string
  {
    return $this->media_type;
  }

  public function setMediaType(string $media_type): self
  {
    $this->media_type = $media_type;

    return $this;
  }

  public function getMediaLink(): ?string
  {
    return $this->media_link;
  }

  public function setMediaLink(string $media_link): self
  {
    $this->media_link = $media_link;

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

  public function getCategory(): ?Category
  {
    return $this->category;
  }

  public function setCategory(?Category $category): self
  {
    $this->category = $category;

    return $this;
  }

  /**
   * @return Collection|Design[]
   */
  public function getDesigns(): Collection
  {
    return $this->designs;
  }

  public function addDesign(Design $design): self
  {
    if (!$this->designs->contains($design)) {
      $this->designs[] = $design;
    }

    return $this;
  }

  public function removeDesign(Design $design): self
  {
    if ($this->designs->contains($design)) {
      $this->designs->removeElement($design);
    }

    return $this;
  }
}

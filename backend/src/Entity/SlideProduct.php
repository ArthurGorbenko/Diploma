<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SlideProductRepository")
 */
class SlideProduct
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="string", length=255,nullable=true)
   */
  private $title;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Product")
   * @ORM\JoinColumn(nullable=false)
   */
  private $product;

  /**
   * @ORM\OneToOne(targetEntity="App\Entity\Slide", cascade={"persist", "remove"})
   * @ORM\JoinColumn(nullable=false,onDelete="CASCADE")
   */
  private $slide;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $event;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $country;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Label")
   */
  private $labels;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $price1;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $price1_detail;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $price2;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $price2_detail;

  public function __construct()
  {
    $this->labels = new ArrayCollection();
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

  public function getProduct(): ?Product
  {
    return $this->product;
  }

  public function setProduct(?Product $product): self
  {
    $this->product = $product;

    return $this;
  }

  public function getSlide(): ?Slide
  {
    return $this->slide;
  }

  public function setSlide(Slide $slide): self
  {
    $this->slide = $slide;

    return $this;
  }

  public function getEvent(): ?string
  {
    return $this->event;
  }

  public function setEvent(?string $event): self
  {
    $this->event = $event;

    return $this;
  }

  public function getCountry(): ?string
  {
    return $this->country;
  }

  public function setCountry(string $country): self
  {
    $this->country = $country;

    return $this;
  }

  /**
   * @return Collection|Label[]
   */
  public function getLabels(): Collection
  {
    return $this->labels;
  }

  public function addLabel(Label $label): self
  {
    if (!$this->labels->contains($label)) {
      $this->labels[] = $label;
    }

    return $this;
  }

  public function removeLabel(Label $label): self
  {
    if ($this->labels->contains($label)) {
      $this->labels->removeElement($label);
    }

    return $this;
  }

  public function getPrice1(): ?string
  {
    return $this->price1;
  }

  public function setPrice1(string $price1): self
  {
    $this->price1 = $price1;

    return $this;
  }

  public function getPrice1Detail(): ?string
  {
    return $this->price1_detail;
  }

  public function setPrice1Detail(string $price1_detail): self
  {
    $this->price1_detail = $price1_detail;

    return $this;
  }

  public function getPrice2(): ?string
  {
    return $this->price2;
  }

  public function setPrice2(string $price2): self
  {
    $this->price2 = $price2;

    return $this;
  }

  public function getPrice2Detail(): ?string
  {
    return $this->price2_detail;
  }

  public function setPrice2Detail(string $price2_detail): self
  {
    $this->price2_detail = $price2_detail;

    return $this;
  }
}

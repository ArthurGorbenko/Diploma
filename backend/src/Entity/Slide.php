<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SlideRepository")
 */
class Slide
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
  private $type;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Slideshow",inversedBy="slides")
   * @ORM\JoinColumn(nullable=false,onDelete="CASCADE")
   */
  private $slideshow;

  /**
   * @ORM\Column(type="integer")
   */
  private $number;

  /**
   * @ORM\Column(type="boolean")
   */
  private $disabled;

  /**
   * @ORM\OneToOne(targetEntity="App\Entity\SlideEventImage", mappedBy="slide", cascade={"persist", "remove"})
   */
  private $slideEventImage;

  public function getId(): ?int
  {
    return $this->id;
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

  public function getSlideshow(): ?Slideshow
  {
    return $this->slideshow;
  }

  public function setSlideshow(?Slideshow $slideshow): self
  {
    $this->slideshow = $slideshow;

    return $this;
  }

  public function getNumber(): ?int
  {
    return $this->number;
  }

  public function setNumber(int $number): self
  {
    $this->number = $number;

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

  public function getSlideEventImage(): ?SlideEventImage
  {
    return $this->slideEventImage;
  }

  public function setSlideEventImage(SlideEventImage $slideEventImage): self
  {
    $this->slideEventImage = $slideEventImage;

    // set the owning side of the relation if necessary
    if ($slideEventImage->getSlide() !== $this) {
      $slideEventImage->setSlide($this);
    }

    return $this;
  }
}

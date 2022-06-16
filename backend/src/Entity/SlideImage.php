<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SlideImageRepository")
 */
class SlideImage
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
  private $image_link;

  /**
   * @ORM\OneToOne(targetEntity="App\Entity\Slide", cascade={"persist", "remove"})
   * @ORM\JoinColumn(nullable=false,onDelete="CASCADE")
   */
  private $slide;

  public function getId(): ?int
  {
    return $this->id;
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

  public function getSlide(): ?Slide
  {
    return $this->slide;
  }

  public function setSlide(Slide $slide): self
  {
    $this->slide = $slide;

    return $this;
  }
}

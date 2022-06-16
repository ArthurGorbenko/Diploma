<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SlideEventImageRepository")
 */
class SlideEventImage
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\EventImage", inversedBy="slideEventImages")
   * @ORM\JoinColumn(nullable=false)
   */
  private $event_image;

  /**
   * @ORM\OneToOne(targetEntity="App\Entity\Slide", inversedBy="slideEventImage", cascade={"persist", "remove"})
   * @ORM\JoinColumn(nullable=false)
   */
  private $slide;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getEventImage(): ?EventImage
  {
    return $this->event_image;
  }

  public function setEventImage(?EventImage $event_image): self
  {
    $this->event_image = $event_image;

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

<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SlideVideoRepository")
 */
class SlideVideo
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
  private $video_link;

  /**
   * @ORM\OneToOne(targetEntity="App\Entity\Slide", cascade={"persist", "remove"})
   * @ORM\JoinColumn(nullable=false,onDelete="CASCADE")
   */
  private $slide;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getVideoLink(): ?string
  {
    return $this->video_link;
  }

  public function setVideoLink(string $video_link): self
  {
    $this->video_link = $video_link;

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

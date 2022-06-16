<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EventImageRepository")
 */
class EventImage
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\ManyToOne(targetEntity="App\Entity\Event", inversedBy="eventImages")
   * @ORM\JoinColumn(nullable=false)
   */
  private $event;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $image_link;

  /**
   * @ORM\OneToMany(targetEntity="App\Entity\SlideEventImage", mappedBy="event_image", orphanRemoval=true)
   */
  private $slideEventImages;

  public function __construct()
  {
    $this->slideEventImages = new ArrayCollection();
  }

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getEvent(): ?Event
  {
    return $this->event;
  }

  public function setEvent(?Event $event): self
  {
    $this->event = $event;

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

  /**
   * @return Collection|SlideEventImage[]
   */
  public function getSlideEventImages(): Collection
  {
    return $this->slideEventImages;
  }

  public function addSlideEventImage(SlideEventImage $slideEventImage): self
  {
    if (!$this->slideEventImages->contains($slideEventImage)) {
      $this->slideEventImages[] = $slideEventImage;
      $slideEventImage->setEventImage($this);
    }

    return $this;
  }

  public function removeSlideEventImage(SlideEventImage $slideEventImage): self
  {
    if ($this->slideEventImages->contains($slideEventImage)) {
      $this->slideEventImages->removeElement($slideEventImage);
      // set the owning side to null (unless already changed)
      if ($slideEventImage->getEventImage() === $this) {
        $slideEventImage->setEventImage(null);
      }
    }

    return $this;
  }
}
